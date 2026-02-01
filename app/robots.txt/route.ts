import { NextResponse } from 'next/server';

export function GET() {
  return new NextResponse(
    `User-agent: *
Allow: /`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
}