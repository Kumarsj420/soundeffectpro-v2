import { connectDB } from "@/app/lib/dbConnection";
import Fav from "@/app/models/Fav";
import File from "@/app/models/File";
import { requireAuth } from "@/app/lib/getSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const session = await requireAuth();
        const uid = session?.user.uid;

        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;
        const skip = (page - 1) * limit;

        const favs = await Fav.find({ uid }).select("s_id");

        if (!favs.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No favorite sounds found",
                },
                { status: 404 }
            );
        }

        const soundIds = favs.map((fav) => fav.s_id);

        const total = await File.countDocuments({
            s_id: { $in: soundIds },
            visibility: true,
        });

        const files = await File.find({
            s_id: { $in: soundIds },
            visibility: true,
        })
            .sort({ "stats.views": -1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            success: true,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            data: files,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "server error",
                error: String(error),
            },
            { status: 500 }
        );
    }
}
