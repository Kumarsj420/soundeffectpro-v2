import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/getSession';
import { connectDB } from '@/app/lib/dbConnection';
import File from '@/app/models/File';
import { incrementFileStat } from '@/app/lib/fileStatInc';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        console.log('Requested file ID:', id);

        await connectDB();

        const session = await requireAuth();
        const sessionUid = session?.user?.uid || null;

        const file = await File.findOne({ s_id: id }).lean();
        console.log('Found file:', file);

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'File not found' },
                { status: 404 }
            );
        }

        if (!file.visibility && file.user.uid !== sessionUid) {
            return NextResponse.json(
                { success: false, message: 'You do not have permission to download this file' },
                { status: 403 }
            );
        }

        const fileKey = `store/${id}.mp3`;
        const r2Url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileKey}`;

        const response = await fetch(r2Url);

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: 'File not available in storage' },
                { status: 404 }
            );
        }

        const blob = await response.blob();

        await File.updateOne(
            { s_id: id },
            { $inc: { 'stats.downloads': 1 } }
        );

        await incrementFileStat(id, 'downloads');

        return new NextResponse(blob, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': `attachment; filename="${(file.title || id) + ' | soundeffectpro.com'}.mp3"`,
                'Content-Length': blob.size.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to download file. Please try again.' },
            { status: 500 }
        );
    }
}