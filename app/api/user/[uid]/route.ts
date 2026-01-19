import { connectDB } from "@/app/lib/dbConnection";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uid: string }> }
) {
    try {
        await connectDB();

        const { uid } = await params;

        const user = await User.findOne({ uid }).select("-_id -__v");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
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
