import { NextResponse } from "next/server";
import { uploadToR2 } from "@/app/lib/r2/r2upload";
import { requireAuth } from "@/app/lib/getSession";

export async function POST(req: Request) {
    try {
        const session = await requireAuth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as "store" | "thumb" | "avatars";

        if (!file || !folder) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await uploadToR2({
            file: buffer,
            folder,
            fileName: file.name,
            contentType: file.type
        })

        return NextResponse.json(result);

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}