import { connectDB } from "@/app/lib/dbConnection";
import Fav from "@/app/models/Fav";
import File, { IFile } from "@/app/models/File";
import { requireAuth } from "@/app/lib/getSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const session = await requireAuth();
    const uid = session?.user?.uid;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    // Fetch fav sound ids
    const favs = await Fav.find({ uid })
      .select("s_id -_id")
      .lean<{ s_id: string }[]>();

    if (!favs.length) {
      return NextResponse.json({
        success: true,
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0
        },
        data: []
      });
    }

    const soundIds = favs.map(f => f.s_id);

    const query = {
      s_id: { $in: soundIds },
      visibility: true
    };

    const [total, files] = await Promise.all([
      File.countDocuments(query),

      File.find(query)
        .sort({ "stats.views": -1 })
        .skip(skip)
        .limit(limit)
        .lean<IFile[]>()
    ]);

    // Add isFav flag (always true here)
    const filesWithFav = files.map(file => ({
      ...file,
      isFav: true
    }));

    return NextResponse.json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: filesWithFav
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: String(error)
      },
      { status: 500 }
    );
  }
}
