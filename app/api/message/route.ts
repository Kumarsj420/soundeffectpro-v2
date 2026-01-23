import { NextRequest, NextResponse } from "next/server";
import mongoose, { FilterQuery } from "mongoose";
import { connectDB } from "@/app/lib/dbConnection";
import Message, { IMessage } from "@/app/models/Message";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const type = searchParams.get("type");
        const read = searchParams.get("read");
        const search = searchParams.get("search");

        const query: FilterQuery<IMessage> = {};

        if (type) query.type = type;

        if (read !== null) {
            if (read === "true") query.read = true;
            if (read === "false") query.read = false;
        }

        // Search by email or content
        if (search) {
            query.$or = [
                { senderEmail: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            Message.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-__v"),

            Message.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: messages,
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
                message: "Failed to fetch messages",
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

        const { senderEmail, type, content } = body;

        if (!senderEmail || !content) {
            return NextResponse.json(
                { success: false, message: "Email and content are required" },
                { status: 400 }
            );
        }

        const message = await Message.create({
            senderEmail,
            type,
            content
        });

        return NextResponse.json(
            {
                success: true,
                message: "Message sent successfully",
                data: message
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to send message",
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
                { success: false, message: "Invalid message id" },
                { status: 400 }
            );
        }

        const body = await request.json();

        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        ).select("-__v");

        if (!updatedMessage) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Message updated",
            data: updatedMessage
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update message",
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
                { success: false, message: "Invalid message id" },
                { status: 400 }
            );
        }

        const deletedMessage = await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Message deleted successfully"
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete message",
                error: String(error)
            },
            { status: 500 }
        );
    }
}
