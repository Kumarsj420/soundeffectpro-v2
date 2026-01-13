import { NextResponse } from "next/server";
import { deleteFromR2 } from "@/app/lib/r2delete";
import { requireAuth } from "@/app/lib/getSession";
export async function POST(req: Request) {
    try {
        const session = await requireAuth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { key } = await req.json();

        if (!key) {
            return NextResponse.json({ error: 'Missing Key' }, { status: 400 })
        }

        await deleteFromR2(key);

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}