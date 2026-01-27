import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnection";
import File, { IFile } from "@/app/models/File";
import Fav from "@/app/models/Fav";
import { requireAuth } from "@/app/lib/getSession";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await requireAuth();
    const uid = session?.user?.uid || null;

    const sp = req.nextUrl.searchParams;

    const s_id = sp.get("s_id");

    if (!s_id) {
      return NextResponse.json(
        { success: false, message: "s_id required" },
        { status: 400 }
      );
    }

    const page = Number(sp.get("page") || 1);
    const limit = Number(sp.get("limit") || 20);
    const skip = (page - 1) * limit;

    const category = sp.get("category");
    const tags = sp.get("tags")?.split(",") ?? [];

    // ---------- FAST FILTER ----------
    const matchStage: Record<string, any> = {
      s_id: { $ne: s_id },
      visibility: true
    };

    if (category) {
      matchStage.category = category;
    }

    if (tags.length) {
      matchStage.tags = { $in: tags };
    }

    // ---------- AGGREGATION PIPELINE ----------
    const pipeline: PipelineStage[] = [

      // Filter early
      { $match: matchStage },

      // Remove duplicates (safety)
      {
        $group: {
          _id: "$s_id",
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: {
          newRoot: "$doc"
        }
      },

      // Lightweight scoring
      {
        $addFields: {
          score: {
            $add: [
              category ? 50 : 0,
              tags.length
                ? { $size: { $setIntersection: ["$tags", tags] } }
                : 0
            ]
          }
        }
      },

      // Stable sorting (important)
      {
        $sort: {
          score: -1,
          createdAt: -1,
          _id: 1
        }
      },

      // Pagination
      { $skip: skip },
      { $limit: limit }
    ];

    // ---------- PARALLEL DB CALLS ----------
    const [files, total] = await Promise.all([
      File.aggregate<IFile>(pipeline),

      File.countDocuments(matchStage)
    ]);

    // ---------- FAVORITES MERGE ----------
    let favSet = new Set<string>();

    if (uid && files.length) {
      const favs = await Fav.find({
        uid,
        s_id: { $in: files.map(f => f.s_id) }
      })
        .select("s_id -_id")
        .lean<{ s_id: string }[]>();

      favSet = new Set(favs.map(f => f.s_id));
    }

    // ---------- FINAL RESULT ----------
    const result = files.map(file => ({
      ...file,
      isFav: favSet.has(file.s_id)
    }));

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error("Related API Error:", err);

    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
