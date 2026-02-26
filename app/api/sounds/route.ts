import { connectDB } from "@/app/lib/dbConnection";
import File, { IFile } from "@/app/models/File";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/getSession";
import { FilterQuery } from "mongoose";
import { FileSchema } from "@/app/lib/validators/file.schema";
import { uploadAudioToR2 } from "@/app/lib/r2/r2audioUpload";
import User from "@/app/models/User";
import Fav from "@/app/models/Fav";


type SortOrder = 1 | -1;

export const runtime = "nodejs";

export const dynamic = "force-static"; 

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50); // prevent abuse

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const userId = searchParams.get("userId");
    const tag = searchParams.get("tag");

    const skip = (page - 1) * limit;

    const query: FilterQuery<IFile> = {
      visibility: true,
    };

    if (category) {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (userId) query["user.uid"] = userId;

    if (tag) {
      query.tags = {
        $elemMatch: { $regex: `^${tag}$`, $options: "i" }
      };
    }

    if (search) {
      query.$text = { $search: search };
    }

    let sounds: IFile[] = [];
    let total = 0;

    const isPeriodSort =
      sortBy.startsWith("stats.weekly.") ||
      sortBy.startsWith("stats.monthly.") ||
      sortBy.startsWith("stats.halfYearly.");

    if (isPeriodSort) {
      const [, period, metric] = sortBy.split(".");

      const aggPipeline: any[] = [
        { $match: query },
        { $unwind: `$stats.${period}` },
        {
          $sort: {
            [`stats.${period}.periodStart`]: -1
          }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            latestStat: { $first: `$stats.${period}` }
          }
        },
        {
          $addFields: {
            "doc.latestPeriodStat": "$latestStat"
          }
        },
        { $replaceRoot: { newRoot: "$doc" } },
        {
          $sort: {
            [`latestPeriodStat.${metric}`]: -1,
            _id: -1
          }
        },
        { $skip: skip },
        { $limit: limit },
        { $project: { __v: 0 } }
      ];

      sounds = await File.aggregate(aggPipeline);
      total = await File.countDocuments(query);
    } else {
      const sort: Record<string, 1 | -1> = {
        [sortBy]: order === "asc" ? 1 : -1,
        _id: order === "asc" ? 1 : -1
      };

      sounds = await File.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean();

      total = await File.countDocuments(query);
    }

    return NextResponse.json(
      {
        success: true,
        data: sounds,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      {
        headers: {
          "Cache-Control": "s-maxage=120, stale-while-revalidate=300"
        }
      }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sounds",
        error: String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const files = formData.getAll("audio") as File[];
    const metaRaw = formData.get("metadata") as string;

    if (!files.length || !metaRaw) {
      return NextResponse.json({
        success: false,
        message: "Audio file or metadata missing"
      }, { status: 400 });
    }

    const metadataArray = JSON.parse(metaRaw);

    const metaList = Array.isArray(metadataArray)
      ? metadataArray
      : [metadataArray];

    if (files.length !== metaList.length) {
      return NextResponse.json({
        success: false,
        message: "Audio and metadata count mismatch"
      }, { status: 400 });
    }

    const { validateAudio } = await import("@/app/lib/validators/audioServerValidator");

    const results = [];
    let uploadedCount = 0;
    let uploadUserUid: string | null = null;

    for (let i = 0; i < files.length; i++) {

      const audioFile = files[i];
      const meta = metaList[i];


      if (audioFile.type !== "audio/mpeg") {
        return NextResponse.json({
          success: false,
          message: "Only MP3 audio files are allowed"
        }, { status: 400 });
      }

      if (!audioFile.name.toLowerCase().endsWith(".mp3")) {
        return NextResponse.json({
          success: false,
          message: "Invalid file extension"
        }, { status: 400 });
      }


      const parsed = FileSchema.safeParse(meta);

      if (!parsed.success) {
        return NextResponse.json({
          success: false,
          error: parsed.error.format()
        }, { status: 422 });
      }


      await validateAudio(audioFile);


      const createdFile = await File.create(parsed.data);

      uploadedCount++;
      uploadUserUid = createdFile.user.uid;

      const buffer = Buffer.from(await audioFile.arrayBuffer());

      const uploadResult = await uploadAudioToR2({
        buffer,
        s_id: createdFile.s_id
      });

      results.push({
        ...createdFile.toObject(),
        audio_url: uploadResult.url
      });

    }

    if (uploadUserUid && uploadedCount > 0) {
      await User.updateOne(
        { uid: uploadUserUid },
        { $inc: { filesCount: uploadedCount } }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Audio uploaded successfully",
      data: results
    }, { status: 201 });

  } catch (error: any) {

    console.error(error);

    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: "Duplicate slug or s_id"
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: error.message || "Upload failed"
    }, { status: 500 });

  }
}
