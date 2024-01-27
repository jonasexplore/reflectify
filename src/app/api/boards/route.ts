import { nanoid } from "nanoid";
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
  try {
    const body = await request.json();

    const id = nanoid();

    await prisma.board.create({
      data: {
        id,
        name: body.name,
        userId: body.userId,
        columns: {
          create: {
            id: nanoid(),
            name: "Coluna 1",
            position: 0,
          },
        },
      },
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.log({ error });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
