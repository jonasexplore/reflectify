import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") as string;

  if (!userId) {
    NextResponse.json({}, { status: 404 });
  }

  const boards = await prisma.board.findMany({
    where: { userId },
  });

  return NextResponse.json({ boards }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  await prisma.board.create({
    data: {
      id: body.id,
      name: body.name,
      userId: body.userId,
    },
  });

  return NextResponse.json({}, { status: 201 });
}
