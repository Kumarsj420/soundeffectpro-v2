import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnection";
import { requireAuth } from "@/app/lib/getSession";
import User from "@/app/models/User";
import File from "@/app/models/File";
import Category from "@/app/models/Category";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uid, name } = await req.json();

    if (!uid || !name) {
      return NextResponse.json(
        { error: "uid and name are required" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: { name } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await File.updateMany(
      { "user.uid": uid },
      { $set: { "user.name": name } }
    );

    await Category.updateMany(
      { "user.uid": uid },
      { $set: { "user.name": name } }
    );

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update name" },
      { status: 500 }
    );
  }
}
