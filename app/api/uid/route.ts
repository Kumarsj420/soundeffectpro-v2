import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnection";
import User from "@/app/models/User";
import File from "@/app/models/File";
import Category from "@/app/models/Category";
import Fav from "@/app/models/Fav";
import { deleteFromR2 } from "@/app/lib/r2delete";
import { getR2KeyFromUrl } from "@/app/lib/r2Url";
import { requireAuth } from "@/app/lib/getSession";


export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const session = await requireAuth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { oldUid, newUid } = await req.json();

        if (!oldUid || !newUid) {
            return NextResponse.json(
                { error: "oldUid and newUid are required" },
                { status: 400 }
            );
        }

        await Promise.all([
            User.updateOne({ uid: oldUid }, { $set: { uid: newUid } }),
            File.updateMany({ "user.uid": oldUid }, { $set: { "user.uid": newUid } }),
            Category.updateMany(
                { "user.uid": oldUid },
                { $set: { "user.uid": newUid } }
            ),
            Fav.updateMany({ uid: oldUid }, { $set: { uid: newUid } }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "UID update failed" },
            { status: 500 }
        );
    }
}


export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const session = await requireAuth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { uid } = await req.json();

        if (!uid) {
            return NextResponse.json({ error: "uid is required" }, { status: 400 });
        }

        if (uid !== session.user.uid) {
            return NextResponse.json({ error: "invalid user" }, { status: 400 });
        }

        const user = await User.findOne({ uid });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        const avatarKey = getR2KeyFromUrl(user.image);
        if (avatarKey) {
            await deleteFromR2(avatarKey);
        }


        const files = await File.find({ "user.uid": uid }).select("s_id");
        for (const file of files) {
            await deleteFromR2(`store/${file.s_id}.mp3`);
        }


        const categories = await Category.find({ "user.uid": uid }).select("sb_id");
        for (const cat of categories) {
            await deleteFromR2(`thumb/${cat.sb_id}.webp`);
        }

        await Promise.all([
            User.deleteOne({ uid }),
            File.deleteMany({ "user.uid": uid }),
            Category.deleteMany({ "user.uid": uid }),
            Fav.deleteMany({ uid }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "User deletion failed" },
            { status: 500 }
        );
    }
}
