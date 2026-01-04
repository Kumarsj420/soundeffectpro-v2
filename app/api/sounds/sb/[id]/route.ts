import { connectDB } from "@/app/lib/dbConnection";
import Board from "@/app/models/Sb";
import File from "@/app/models/File";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const sb_id = params.id;

        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 20;

        const skip = (page - 1) * limit;


        const boards = await Board.find({ sb_id }).select("s_id");

        if (!boards.length) {
            return NextResponse.json({
                success: false,
                message: `sounds not found for this soundboard id: ${sb_id}`
            }, { status: 404 })
        }

        const soundIds = boards.map((board) => board.s_id);

        const total = await File.countDocuments({
            s_id: { $in: soundIds },
        });

        const files = await File.find({
            s_id: { $in: soundIds },
            visibility: true,
        })
            .sort({ 'stats.views': -1 })
            .skip(skip)
            .limit(limit)

        return NextResponse.json({
            success: true,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            data: files
        })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: `server error`,
            error: String(error)
        }, { status: 500 })
    }
}