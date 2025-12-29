import { connectDB } from "@/app/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/app/models/Category";
import { data } from "motion/react-client";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'stats.views';
        const order = searchParams.get('order') || 'desc';
        const sbID = searchParams.get('sbID');
        const visibility = searchParams.get('visibility');
        const thumb = searchParams.get('thumb');

        const query: any = {};
        if (search) query.$text = { $search: search };
        if (sbID) query.sb_id = sbID;
        if (visibility) query.visibility = visibility;
        if (thumb === 'true') {
            query.thumb = { $ne: null };
        }

        const sort: any = {
            [sortBy]: order === 'asc' ? 1 : -1,
            _id: order === 'asc' ? 1 : -1,
        }

        const skip = (page - 1) * limit;

        const [category, total] = await Promise.all([
            Category.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            Category.countDocuments(query)
        ])

        return NextResponse.json({
            success: true,
            data: category,
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
            message: 'failed to fetch category details',
            error: String(error)
        }, { status: 500 })
    }
}