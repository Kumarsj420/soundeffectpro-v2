import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnection";
import File from "@/app/models/File";
import Category from "@/app/models/Category";

interface UserResult {
    name: string;
    uid: string;
}

interface FileResult {
    title: string;
    duration: string;
    s_id: string;
}

interface CategoryResult {
    name: string;
    thumb: string | null;
    sb_id: string;
}

interface SearchResults {
    files: FileResult[];
    categories: CategoryResult[];
    users: UserResult[];
    total_files: number;
    total_categories: number;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ search: string }> }
) {
    try {
        await connectDB();

        const { search } = await params;
        const searchTerm = decodeURIComponent(search).trim();

        if (searchTerm.length < 2) {
            return NextResponse.json({
                success: true,
                data: {
                    files: [],
                    categories: [],
                    users: [],
                    total_files: 0,
                    total_categories: 0,
                },
            });
        }


        const fileQuery = {
            $text: { $search: searchTerm },
            visibility: true,
        };

        const categoryQuery = {
            $text: { $search: searchTerm },
            visibility: true,
            total_sfx: { $gt: 0 },
            thumb: { $ne: null },
        };


        const userFileQuery = {
            "user.name": { $regex: searchTerm, $options: "i" },
            visibility: true,
        };

        const userCategoryQuery = {
            "user.name": { $regex: searchTerm, $options: "i" },
            visibility: true,
        };


        const filesPromise = File.find(fileQuery, {
            score: { $meta: "textScore" }
        })
            .sort({ score: { $meta: "textScore" }, "stats.views": -1,  })
            .select("s_id title duration slug")
            .limit(7)
            .lean()
            .exec();


        const totalFilesPromise = File.countDocuments(fileQuery);

        const categoriesPromise = Category.find(categoryQuery, {
            score: { $meta: "textScore" }
        })
            .sort({ score: { $meta: "textScore" }, "stats.views": -1, })
            .select("sb_id name thumb slug")
            .limit(7)
            .lean()
            .exec();


        const totalCategoriesPromise = Category.countDocuments(categoryQuery);

        const fileUsersPromise = File.find(userFileQuery)
            .select("user.name user.uid")
            .limit(20)
            .lean()
            .exec();


        const categoryUsersPromise = Category.find(userCategoryQuery)
            .select("user.name user.uid")
            .limit(20)
            .lean()
            .exec();


        const [
            files,
            totalFiles,
            categories,
            totalCategories,
            fileUsers,
            categoryUsers,
        ] = await Promise.all([
            filesPromise,
            totalFilesPromise,
            categoriesPromise,
            totalCategoriesPromise,
            fileUsersPromise,
            categoryUsersPromise,
        ]);

        const userMap = new Map<string, UserResult>();


        fileUsers.forEach((file: any) => {
            if (file.user && file.user.uid && !userMap.has(file.user.uid)) {
                userMap.set(file.user.uid, {
                    name: file.user.name,
                    uid: file.user.uid,
                });
            }
        });


        categoryUsers.forEach((category: any) => {
            if (category.user && category.user.uid && !userMap.has(category.user.uid)) {
                userMap.set(category.user.uid, {
                    name: category.user.name,
                    uid: category.user.uid,
                });
            }
        });


        const users = Array.from(userMap.values()).slice(0, 10);

        const results: SearchResults = {
            files: files.map((file: any) => ({
                title: file.title,
                duration: file.duration,
                s_id: file.s_id,
                slug: file.slug,
            })),
            categories: categories.map((category: any) => ({
                name: category.name,
                thumb: category.thumb,
                sb_id: category.sb_id,
                slug: category.slug,
            })),
            users,
            total_files: totalFiles > 100 ? totalFiles * 17 : totalFiles ,
            total_categories: totalCategories,
        };

        return NextResponse.json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error("Live search error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to perform search",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}