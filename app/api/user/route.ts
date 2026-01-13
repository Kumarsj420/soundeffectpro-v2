import { connectDB } from "@/app/lib/dbConnection";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/getSession";

export async function PATCH(request: NextRequest) {
    try {
        await connectDB();

        const session = await requireAuth();

        if (!session) {
            return NextResponse.json(
                { success: false, message: "please login to update your info" },
                { status: 403 }
            );
        }

        const uid = session?.user.uid;
        const body = await request.json();
        const { ...updates } = body;

        if (!uid) {
            return NextResponse.json(
                { success: false, message: "uid is required" },
                { status: 400 }
            );
        }

        const user = await User.findOneAndUpdate(
            { uid },
            { $set: updates },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Server error",
                error: String(error),
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { uid } = await request.json();

        if (!uid) {
            return NextResponse.json(
                { success: false, message: "uid is required" },
                { status: 400 }
            );
        }

        const user = await User.findOneAndDelete({ uid });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Server error",
                error: String(error),
            },
            { status: 500 }
        );
    }
}

