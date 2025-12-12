import { connectDB } from '@/app/lib/dbConnection';
import File from '@/app/models/File';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const trending = await File.find()
      .sort({ views: -1 })
      .limit(limit)
      .select('s_id title slug duration views downloads category user tags');
    
    return NextResponse.json({
      success: true,
      data: trending
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trending sounds',
      error: String(error)
    }, { status: 500 });
  }
}