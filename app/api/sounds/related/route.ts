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
    const tags = sp.get("tags")?.split(",").filter(Boolean) ?? [];

    // ---------- STRATEGY 1: Category + Tags Match ----------
    let files: IFile[] = [];
    let matchStage: Record<string, any> = {
      s_id: { $ne: s_id },
      visibility: true
    };

    if (category && tags.length) {
      matchStage.category = category;
      matchStage.tags = { $in: tags };
      
      files = await executePipeline(matchStage, tags, category, skip, limit);
    }

    // ---------- STRATEGY 2: Category OR Tags (Relaxed) ----------
    if (files.length === 0 && (category || tags.length)) {
      matchStage = {
        s_id: { $ne: s_id },
        visibility: true,
        $or: []
      };

      if (category) matchStage.$or.push({ category });
      if (tags.length) matchStage.$or.push({ tags: { $in: tags } });

      files = await executePipeline(matchStage, tags, category, skip, limit);
    }

    // ---------- STRATEGY 3: Same Category Only ----------
    if (files.length === 0 && category) {
      matchStage = {
        s_id: { $ne: s_id },
        visibility: true,
        category
      };

      files = await executePipeline(matchStage, [], category, skip, limit);
    }

    // ---------- STRATEGY 4: Random Posts ----------
    if (files.length === 0) {
      matchStage = {
        s_id: { $ne: s_id },
        visibility: true
      };

      const pipeline: PipelineStage[] = [
        { $match: matchStage },
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
        { $sample: { size: limit } }, // Random sampling
        {
          $sort: {
            createdAt: -1,
            _id: 1
          }
        }
      ];

      files = await File.aggregate<IFile>(pipeline);
    }

    // ---------- TOTAL COUNT ----------
    const total = await File.countDocuments({
      s_id: { $ne: s_id },
      visibility: true
    });

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

// ---------- HELPER FUNCTION ----------
async function executePipeline(
  matchStage: Record<string, any>,
  tags: string[],
  category: string | null,
  skip: number,
  limit: number
): Promise<IFile[]> {
  const pipeline: PipelineStage[] = [
    { $match: matchStage },
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
    {
      $sort: {
        score: -1,
        createdAt: -1,
        _id: 1
      }
    },
    { $skip: skip },
    { $limit: limit }
  ];

  return File.aggregate<IFile>(pipeline);
}