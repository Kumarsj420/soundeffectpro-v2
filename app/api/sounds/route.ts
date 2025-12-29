import { connectDB } from "@/app/lib/dbConnection";
import File from "@/app/models/File";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'createdAt'; // createdAt, views, downloads
        const order = searchParams.get('order') || 'desc'; // asc, desc
        const userId = searchParams.get('userId');
        const tag = searchParams.get('tag');

        const query: any = {};
        if (category) query.category = category;
        if (userId) query['user.uid'] = userId;
        if (tag) query.tags = tag;
        if (search) query.$text = { $search: search };

        const sort: any = {
            [sortBy]: order === 'asc' ? 1 : -1,
            _id: order === 'asc' ? 1 : -1, 
        };


        const skip = (page - 1) * limit;

        const [sounds, total] = await Promise.all([
            File.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            File.countDocuments(query)
        ])

        return NextResponse.json({
            success: true,
            data: sounds,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch sounds',
            error: String(error)
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const { s_id, title, slug, duration, category, user, tags } = body;

        if (!s_id || !title || !slug || !duration || !category || !user || !tags) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields'
            }, { status: 400 })
        }

        const newSound = await File.create(body);

        return NextResponse.json({
            success: true,
            message: 'Sound uploaded successfully',
            data: newSound
        }, { status: 201 })

    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({
                success: false,
                message: 'Sound with this s_id or slug already exists'
            }, { status: 409 });
        }

        return NextResponse.json({
            success: false,
            message: 'failed to create sound',
            error: String(error)
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const sound_id = searchParams.get('sound_id');
        const user_id = searchParams.get('user_id');

        if (!sound_id && !user_id) {
            return NextResponse.json({
                success: false,
                message: 'Please provide sound_id or user_id'
            }, { status: 400 });
        }

        const query: any = {};

        if (sound_id && user_id) {
            query.s_id = sound_id;
            query['user.uid'] = user_id;
        } else if (sound_id) {
            query.s_id = sound_id;
        } else if (user_id) {
            query['user.uid'] = user_id;
        }

        const deletedSounds = await File.deleteMany(query);

        if (deletedSounds.deletedCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'No sounds found to delete'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `${deletedSounds.deletedCount} sound(s) deleted successfully`,
            data: {
                deletedCount: deletedSounds.deletedCount
            }
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to delete sounds',
            error: String(error)
        }, { status: 500 });
    }
}