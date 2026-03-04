import { connectDB } from "@/app/lib/dbConnection";
import File from "@/app/models/File";
import Fav from "@/app/models/Fav";
import { requireAuth } from "@/app/lib/getSession";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";
import { deleteFromR2 } from "@/app/lib/r2/r2delete";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;


    const sound = await File.findOne({
      $or: [{ s_id: id }, { slug: id }],
      visibility: true
    });

    if (!sound) {
      return NextResponse.json(
        {
          success: false,
          message: "Sound not found"
        },
        { status: 404 }
      );
    }

    const soundObj = sound.toObject();

    let isFav = false;



    return NextResponse.json({
      success: true,
      data: {
        ...soundObj,
        isFav
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sound",
        error: String(error)
      },
      {
        headers: {
          "Cache-Control": "s-maxage=120, stale-while-revalidate=300"
        }
      },
      { status: 500 }
    );
  }
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    delete body._id;
    delete body.s_id;

    const updateData = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value !== undefined)
    );

    const updatedSound = await File.findOneAndUpdate(
      { s_id: id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedSound) {
      return NextResponse.json(
        { success: false, message: "Sound not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sound patched successfully",
      data: updatedSound
    });

  } catch (error) {
    console.error("PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to patch sound"
      },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    console.log("DELETE ID:", id);

    const session = await requireAuth();
    const uid = session?.user?.uid;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized, Please login' },
        { status: 401 }
      );
    }

    const sound = await File.findOne({ s_id: id });

    if (!sound) {
      return NextResponse.json(
        { success: false, message: `Sound not found` },
        { status: 404 }
      );
    }

    if (sound.user?.uid !== uid) {
      return NextResponse.json(
        { success: false, message: 'Permission denied for deleting' },
        { status: 403 }
      );
    }

    const r2Key = `store/${id}.mp3`;

    await deleteFromR2(r2Key);

    await File.deleteOne({ _id: sound._id });

    await User.updateOne(
      { uid },
      { $inc: { filesCount: -1 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Sound deleted successfully'
    });

  } catch (error) {
    console.error('Delete sound error:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to delete sound' },
      { status: 500 }
    );
  }
}
