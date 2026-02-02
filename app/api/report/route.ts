import { NextRequest, NextResponse } from "next/server";
import mongoose, { FilterQuery } from "mongoose";
import { connectDB } from "@/app/lib/dbConnection";
import Report, { IReport } from "@/app/models/Report";
import { reportValidationSchema } from "@/app/lib/validators/report.schema";

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

        const { senderEmail, type, content, target } = body;

        const validated = reportValidationSchema.safeParse({
            senderEmail,
            type,
            content,
        });

        if (!validated.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: validated.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        if (!target?.from || !target?.id) {
            return NextResponse.json(
                { success: false, message: "Target information missing" },
                { status: 400 }
            );
        }

        if (!["sound", "soundboard"].includes(target.from)) {
            return NextResponse.json(
                { success: false, message: "Invalid target type" },
                { status: 400 }
            );
        }

        const alreadyReported = await Report.findOne({
            senderEmail: validated.data.senderEmail,
            "target.id": target.id,
            "target.from": target.from,
        });

        if (alreadyReported) {
            return NextResponse.json(
                { success: false, message: "You already reported this item" },
                { status: 409 }
            );
        }

        const report = await Report.create({
            senderEmail: validated.data.senderEmail,
            type: validated.data.type,
            content: validated.data.content,
            target: {
                from: target.from,
                id: target.id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Report submitted successfully",
                data: report,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to submit report",
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

        // Allow ONLY read update
        const updateData: Partial<{ read: boolean }> = {};

        if (typeof body.read === "boolean") {
            updateData.read = body.read;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: "No valid fields to update" },
                { status: 400 }
            );
        }

        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { $set: updateData },
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
            data: updatedReport,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update report",
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
