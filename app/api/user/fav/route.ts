import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnection";
import Fav from "@/app/models/Fav";
import File from "@/app/models/File";
import { requireAuth } from "@/app/lib/getSession";
import User from "@/app/models/User";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await requireAuth();
    const uid = session?.user?.uid;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { s_id } = await req.json();

    if (!s_id) {
      return NextResponse.json(
        { success: false, message: "Sound ID is required" },
        { status: 400 }
      );
    }

    // Check favorite exists
    const existingFav = await Fav.findOne({ uid, s_id });

    // ---------------- UNLIKE ----------------
    if (existingFav) {

      await Promise.all([
        Fav.deleteOne({ uid, s_id }),

        // prevent negative likes
        File.updateOne(
          { s_id, "stats.likes": { $gt: 0 } },
          { $inc: { "stats.likes": -1 } }
        ),

        User.updateOne(
          { uid },
          { $inc: { favCount: -1 } }
        )
      ]);

      return NextResponse.json({
        success: true,
        status: "unliked",
        message: "Unliked successfully"
      });
    }

    await Promise.all([
      Fav.create({ uid, s_id }),

      File.updateOne(
        { s_id },
        { $inc: { "stats.likes": 1 } }
      ),

      User.updateOne(
        { uid },
        { $inc: { favCount: 1 } }
      )
    ]);

    return NextResponse.json({
      success: true,
      status: "liked",
      message: "Liked successfully"
    });

  } catch (error) {
    console.error("Fav Toggle Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update favorite",
        error: String(error)
      },
      { status: 500 }
    );
  }
}
