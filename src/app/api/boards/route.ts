import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({}, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    });

    if (!user) {
      return NextResponse.json({}, { status: 401 });
    }

    const boards = await prisma.board.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ boards }, { status: 200 });
  } catch (error) {
    console.log({ error });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({}, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    });

    if (!user) {
      return NextResponse.json({}, { status: 401 });
    }

    const body = await request.json();

    const id = nanoid();

    const output = await prisma.board.create({
      data: {
        id,
        name: body.name,
        userId: user.id,
        isPublic: body.isPublic,
        columns: {
          create: {
            id: nanoid(),
            name: "To do",
            position: 0,
          },
        },
      },
    });

    return NextResponse.json(output, { status: 201 });
  } catch (error) {
    console.log({ error });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
