import { connectDB } from '@/app/lib/dbConnection';
import File from '@/app/models/File';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const topDownloads = await File.find()
      .sort({ downloads: -1 })
      .limit(limit)
      .select('s_id title slug duration views downloads category user tags');
    
    return NextResponse.json({
      success: true,
      data: topDownloads
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch top downloads',
      error: String(error)
    }, { status: 500 });
  }
}