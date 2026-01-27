import { connectDB } from "@/app/lib/dbConnection";
import Board from "@/app/models/Sb";
import File, { IFile } from "@/app/models/File";
import Fav from "@/app/models/Fav";
import { requireAuth } from "@/app/lib/getSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        const session = await requireAuth();
        const uid = session?.user?.uid || null;

        const { searchParams } = new URL(request.url);

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;

        const skip = (page - 1) * limit;

        const boards = await Board.find({ sb_id: id })
            .select("s_id -_id")
            .lean<{ s_id: string }[]>();

        if (!boards.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: `sounds not found for this soundboard id: ${id}`
                },
                { status: 404 }
            );
        }

        const soundIds = boards.map(b => b.s_id);

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

        const filesWithFav = files.map(file => ({
            ...file,
            isFav: favSet.has(file.s_id)
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
                message: "server error",
                error: String(error)
            },
            { status: 500 }
        );
    }
}
