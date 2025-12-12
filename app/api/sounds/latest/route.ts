import { connectDB } from '@/app/lib/dbConnection';
import File from '@/app/models/File';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const latest = await File.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('s_id title slug duration views downloads category user tags createdAt');
    
    return NextResponse.json({
      success: true,
      data: latest
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch latest sounds',
      error: String(error)
    }, { status: 500 });
  }
}