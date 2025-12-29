import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnection";
import File from "@/app/models/File";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sp = req.nextUrl.searchParams;

    const s_id = sp.get("s_id");
    if (!s_id) {
      return NextResponse.json(
        { success: false, message: "s_id required" },
        { status: 400 }
      );
    }

    const page = Number(sp.get("page") ?? 1);
    const limit = Number(sp.get("limit") ?? 20);
    const skip = (page - 1) * limit;

    const category = sp.get("category");
    const tags = sp.get("tags")?.split(",") ?? [];
    const title = sp.get("title") ?? "";

    const titleWords = title
      .split(" ")
      .filter(w => w.length > 3);

    const titleRegex =
      titleWords.length > 0
        ? new RegExp(titleWords.join("|"), "i")
        : null;

    const pipeline: any[] = [
      { $match: { s_id: { $ne: s_id } } },

      {
        $addFields: {
          score: {
            $add: [
              // 1️⃣ Same category
              category
                ? { $cond: [{ $eq: ["$category", category] }, 50, 0] }
                : 0,

              // 2️⃣ Title similarity
              titleRegex
                ? { $cond: [{ $regexMatch: { input: "$title", regex: titleRegex } }, 40, 0] }
                : 0,

              // 3️⃣ Tag overlap
              tags.length
                ? {
                    $size: {
                      $setIntersection: ["$tags", tags],
                    },
                  }
                : 0,
            ],
          },
        },
      },

      // Only keep meaningful matches
      { $match: { score: { $gt: 0 } } },

      // Highest relevance first
      { $sort: { score: -1, createdAt: -1 } },

      // Pagination
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await File.aggregate(pipeline);

    const total = result.total[0]?.count ?? 0;

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
