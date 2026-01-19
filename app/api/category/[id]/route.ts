import { connectDB } from "@/app/lib/dbConnection";
import Category from "@/app/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const soundboard = await Category.findOne({ sb_id: id });

        if (!soundboard) {
            return NextResponse.json({
                success: false,
                message: `soundboard not exist for this id : ${id}`
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            data: soundboard
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'failed to fetch soundboard data',
            error: String(error)
        }, { status: 500 })
    }
}