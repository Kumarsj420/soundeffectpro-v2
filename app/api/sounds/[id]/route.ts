// app/api/sounds/[id]/route.ts

import { connectDB } from '@/app/lib/dbConnection';
import File from '@/app/models/File';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // Find by s_id or slug
    const sound = await File.findOne({
      $or: [{ s_id: id }, { slug: id }],
      visibility: true
    });

    if (!sound) {
      return NextResponse.json({
        success: false,
        message: 'Sound not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: sound
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch sound',
      error: String(error)
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    delete body.s_id;
    delete body._id;

    const updatedSound = await File.findOneAndUpdate(
      { $or: [{ s_id: id }, { slug: id }] },
      body,
      { new: true, runValidators: true }
    );

    if (!updatedSound) {
      return NextResponse.json({
        success: false,
        message: 'Sound not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Sound updated successfully',
      data: updatedSound
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update sound',
      error: String(error)
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const deletedSound = await File.findOneAndDelete({
      $or: [{ s_id: id }, { slug: id }]
    });

    if (!deletedSound) {
      return NextResponse.json({
        success: false,
        message: 'Sound not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Sound deleted successfully',
      data: deletedSound
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete sound',
      error: String(error)
    }, { status: 500 });
  }
}