import { connectDB } from "@/app/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import Soundboard from "@/app/models/Soundboard";
import Category from "@/app/models/Category";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { sb_id, s_id } = await req.json();

        if (!sb_id || !s_id) {
            return NextResponse.json(
                { success: false, message: "sb_id and s_id are required" },
                { status: 400 }
            );
        }

        const exists = await Soundboard.findOne({ sb_id, s_id });

        if (exists) {
            return NextResponse.json(
                { success: false, message: "Already added to soundboard" },
                { status: 409 }
            );
        }

        const data = await Soundboard.create({
            sb_id,
            s_id,
        });

        // Increment total_sfx in Category
        await Category.findOneAndUpdate(
            { sb_id },
            { $inc: { total_sfx: 1 } }
        );

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add soundboard entry",
            },
            { status: 500 }
        );
    }
}


export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const { sb_id, s_id } = await req.json();

        if (!sb_id || !s_id) {
            return NextResponse.json(
                { success: false, message: "sb_id and s_id are required" },
                { status: 400 }
            );
        }

        const deleted = await Soundboard.findOneAndDelete({
            sb_id,
            s_id,
        });

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Entry not found" },
                { status: 404 }
            );
        }

        // Decrement total_sfx in Category
        await Category.findOneAndUpdate(
            { sb_id },
            { $inc: { total_sfx: -1 } }
        );

        return NextResponse.json({
            success: true,
            message: "Removed from soundboard",
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to remove soundboard entry",
            },
            { status: 500 }
        );
    }
}