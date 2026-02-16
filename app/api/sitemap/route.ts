import { NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/dbConnection'
import File from '@/app/models/File'
import Category from '@/app/models/Category'
import User from '@/app/models/User'

export async function GET() {
    await connectDB()

    const sounds = await File.find({}, 'slug s_id updatedAt createdAt').lean()
    const soundboards = await Category
        .find(
            {
                visibility: true,
                thumb: { $ne: null }
            },
            'slug sb_id updatedAt createdAt'
        )
        .lean()

    const category = await Category
        .find(
            {
                visibility: true,
            },
            'name updatedAt createdAt'
        )
        .lean()

    const users = await User.
        find({
            name: { $ne: null },
            $or: [{ filesCount: { $gt: 0 } }, { categoriesCount: { $gt: 0 } }]
        }, 'name uid')
        .lean()

    return NextResponse.json({ sounds, soundboards, users, category })
}
