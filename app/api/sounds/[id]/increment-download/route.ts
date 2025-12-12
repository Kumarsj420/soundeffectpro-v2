import { connectDB } from '@/app/lib/dbConnection';
import File from '@/app/models/File';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const sound = await File.findOneAndUpdate(
      { $or: [{ s_id: id }, { slug: id }] },
      { $inc: { downloads: 1 } },
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
      message: 'Download count incremented',
      data: { downloads: sound.downloads }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to increment download',
      error: String(error)
    }, { status: 500 });
  }
}
