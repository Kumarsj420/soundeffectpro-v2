import { NextRequest, NextResponse } from "next/server";
import mongoose, { FilterQuery } from "mongoose";
import { connectDB } from "@/app/lib/dbConnection";
import Report, { IReport } from "@/app/models/Report";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const type = searchParams.get("type");
        const from = searchParams.get("from");
        const read = searchParams.get("read");
        const search = searchParams.get("search");

        const query: FilterQuery<IReport> = {};

        // Filters
        if (type) query.type = type;
        if (from) query.from = from;

        if (read !== null) {
            if (read === "true") query.read = true;
            if (read === "false") query.read = false;
        }

        // Search (email + report content)
        if (search) {
            query.$or = [
                { senderEmail: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;

        const [reports, total] = await Promise.all([
            Report.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-__v"),

            Report.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: reports,
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
                message: "Failed to fetch reports",
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

        const { senderEmail, type, from, content } = body;

        // Validation
        if (!senderEmail || !content || !from) {
            return NextResponse.json(
                { success: false, message: "Required fields missing" },
                { status: 400 }
            );
        }

        const report = await Report.create({
            senderEmail,
            type,
            from,
            content
        });

        return NextResponse.json(
            {
                success: true,
                message: "Report submitted successfully",
                data: report
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to submit report",
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
                { success: false, message: "Invalid report id" },
                { status: 400 }
            );
        }

        const body = await request.json();

        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        ).select("-__v");

        if (!updatedReport) {
            return NextResponse.json(
                { success: false, message: "Report not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Report updated successfully",
            data: updatedReport
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update report",
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
                { success: false, message: "Invalid report id" },
                { status: 400 }
            );
        }

        const deletedReport = await Report.findByIdAndDelete(id);

        if (!deletedReport) {
            return NextResponse.json(
                { success: false, message: "Report not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Report deleted successfully"
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete report",
                error: String(error)
            },
            { status: 500 }
        );
    }
}
