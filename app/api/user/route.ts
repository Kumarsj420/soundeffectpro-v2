import { connectDB } from "@/app/lib/dbConnection";
import User, { IUser } from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/getSession";
import { FilterQuery, SortOrder } from "mongoose";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const search = searchParams.get("search");
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const order = searchParams.get("order") || "desc";

        const provider = searchParams.get("provider");
        const language = searchParams.get("language");
        const uid = searchParams.get("uid");

        const query: FilterQuery<IUser> = {};

        // 🔍 Search (name + email)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        // 🎯 Filters
        if (provider) query.provider = provider;
        if (language) query["preference.language"] = language;

        // 🎯 Single user
        if (uid) query.uid = uid;

        // 🔃 Sorting
        const sort: Record<string, SortOrder> = {
            [sortBy]: order === "asc" ? 1 : -1,
            _id: order === "asc" ? 1 : -1
        };

        // 📄 Pagination
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select("-__v"),

            User.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch users",
                error: String(error)
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectDB();

        const session = await requireAuth();

        if (!session) {
            return NextResponse.json(
                { success: false, message: "please login to update your info" },
                { status: 403 }
            );
        }

        const uid = session?.user.uid;
        const body = await request.json();
        const { ...updates } = body;

        if (!uid) {
            return NextResponse.json(
                { success: false, message: "uid is required" },
                { status: 400 }
            );
        }

        const user = await User.findOneAndUpdate(
            { uid },
            { $set: updates },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Server error",
                error: String(error),
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { uid } = await request.json();

        if (!uid) {
            return NextResponse.json(
                { success: false, message: "uid is required" },
                { status: 400 }
            );
        }

        const user = await User.findOneAndDelete({ uid });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Server error",
                error: String(error),
            },
            { status: 500 }
        );
    }
}

