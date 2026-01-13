import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnection";
import User from "@/app/models/User";
import { uidSchema } from "@/app/lib/validators/userSettings.schema";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
        return NextResponse.json({ available: false });
    }

    const normalizedUID = String(uid).trim().toLowerCase();
    const parsed = uidSchema.safeParse(normalizedUID);

    if (!parsed.success) {
        return NextResponse.json(
            { success: false, errors: parsed.error.flatten() },
            { status: 400 }
        );
    }

    await connectDB();

    const exists = await User.findOne({ uid });

    return NextResponse.json({
        available: !exists,
    });
}
