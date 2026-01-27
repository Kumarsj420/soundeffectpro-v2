import { connectDB } from "@/app/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/app/models/Category";
import { CategorySchema } from "@/app/lib/validators/category.schema";
import { uploadThumbToR2 } from "@/app/lib/r2/r2thumbUpload";
import { deleteFromR2 } from "@/app/lib/r2/r2delete";
import sharp from "sharp";
import { FilterQuery } from "mongoose";
import { CategoryInterface } from "@/app/models/Category";
import { requireAuth } from "@/app/lib/getSession";
import User from "@/app/models/User";

type SortOrder = 1 | -1;

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
    const userID = searchParams.get('userID');

    const query: FilterQuery<CategoryInterface> = {};
    if (search) query.$text = { $search: search };
    if (sbID) query.sb_id = sbID;
    if (thumb === 'true') {
      query.thumb = { $ne: null };
    }
    if (userID) query['user.uid'] = userID;

    query.visibility = (visibility) ? visibility : true;



    const sort: Record<string, SortOrder> = {
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

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await requireAuth();
    const uid = session?.user?.uid || null;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const image = formData.get("thumb") as File | null;
    const body = JSON.parse(formData.get("data") as string);

    const parsed = CategorySchema.parse(body);

    const category = await Category.create(parsed);

    if (image) {
      if (image.size > 1024 * 1024) {
        await Category.findByIdAndDelete(category._id);
        return NextResponse.json(
          { success: false, message: "Thumbnail must be under 1MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await image.arrayBuffer());

      // Convert → WEBP
      const webpBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();

      await uploadThumbToR2({
        buffer: webpBuffer,
        sb_id: category.sb_id,
      });

      category.thumb = `${category.sb_id}.webp`;
      await category.save();
    }

    await User.findOneAndUpdate(
      { uid },
      { $inc: { categoriesCount: 1 } }
    );

    return NextResponse.json({
      success: true,
      data: category,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Category creation failed",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const id = formData.get("id") as string;
    const image = formData.get("thumb") as File | null;
    const body = JSON.parse(formData.get("data") as string);

    const parsed = CategorySchema.partial().parse(body);

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // IMAGE UPDATE
    if (image) {

      if (image.size > 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "Thumbnail must be under 1MB" },
          { status: 400 }
        );
      }

      // Delete old thumb
      if (category.thumb) {
        const oldKey = category.thumb.split("/").pop();
        await deleteFromR2(`thumb/${oldKey}`);
      }

      const buffer = Buffer.from(await image.arrayBuffer());

      const webpBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();

      const upload = await uploadThumbToR2({
        buffer: webpBuffer,
        sb_id: category.sb_id,
      });

      parsed.thumb = upload.url;
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      parsed,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Update failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const session = await requireAuth();
    const uid = session?.user?.uid || null;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    if (category.thumb) {
      const key = category.thumb.split("/").pop();
      await deleteFromR2(`thumb/${key}`);
    }

    await Category.findByIdAndDelete(id);

    await User.findOneAndUpdate(
      { uid },
      { $inc: { categoriesCount: -1 } }
    );

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Delete failed",
      },
      { status: 500 }
    );
  }
}



