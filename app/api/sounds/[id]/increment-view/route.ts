import { connectDB } from '@/app/lib/dbConnection';
import File from '@/app/models/File';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const sound = await File.findOneAndUpdate(
      { s_id: id },
      { $inc: { "stats.views" : 1 } },
      { new: true }
    );

    if (!sound) {
      return NextResponse.json({
        success: false,
        message: 'Sound not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'View count incremented',
      data: { views: sound.stats.views }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to increment view',
      error: String(error)
    }, { status: 500 });
  }
}