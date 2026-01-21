import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {

    const res = NextResponse.next();

    const allowedOrigins = [
        "https://soundeffectpro.com",
        "https://soundeffectpro-v2.vercel.app/",
        "http://localhost:3000"
    ];

    const origin = req.headers.get("origin") || "";

    if (allowedOrigins.includes(origin)) {
        res.headers.set("Access-Control-Allow-Origin", origin);
    }

    res.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );

    res.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    res.headers.set("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: res.headers
        });
    }

    return res;
}

export const config = {
    matcher: "/api/:path*",
};
