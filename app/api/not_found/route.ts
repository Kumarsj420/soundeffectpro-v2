import { NextRequest, NextResponse } from "next/server";
import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { connectDB } from "@/app/lib/dbConnection";
import NotFound, { INotFound } from "@/app/models/NotFound";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const search = searchParams.get("search");
        const read = searchParams.get("read");

        const sortBy = searchParams.get("sortBy") || "createdAt";
        const order = searchParams.get("order") || "desc";

        const query: FilterQuery<INotFound> = {};

        if (read !== null) {
            if (read === "true") query.read = true;
            if (read === "false") query.read = false;
        }

        // Search term filter
        if (search) {
            query.searchTerm = { $regex: search, $options: "i" };
        }

        const sort: Record<string, SortOrder> = {
            [sortBy]: order === "asc" ? 1 : -1,
            _id: order === "asc" ? 1 : -1
        };

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            NotFound.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select("-__v"),

            NotFound.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: items,
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
                message: "Failed to fetch not-found records",
                error: String(error)
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { searchTerm } = body;

        if (!searchTerm || searchTerm.length < 2) {
            return NextResponse.json(
                { success: false, message: "Invalid search term" },
                { status: 400 }
            );
        }

        const normalized = searchTerm.trim().toLowerCase();

        const result = await NotFound.findOneAndUpdate(
            { searchTerm: normalized },
            {
                $inc: { count: 1 },
                $setOnInsert: { read: false }
            },
            {
                upsert: true,
                new: true
            }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Search tracked successfully",
                data: result
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to track search",
                error: String(error)
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = request.nextUrl;
        const id = searchParams.get("id");

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid id" },
                { status: 400 }
            );
        }

        const body = await request.json();

        const updated = await NotFound.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        ).select("-__v");

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Record updated successfully",
            data: updated
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update record",
                error: String(error)
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = request.nextUrl;
        const id = searchParams.get("id");

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid id" },
                { status: 400 }
            );
        }

        const deleted = await NotFound.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Record deleted successfully"
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete record",
                error: String(error)
            },
            { status: 500 }
        );
    }
}
