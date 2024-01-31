import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email") as string;

  if (!email) {
    NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = nanoid();

    await prisma.user.create({
      data: {
        id,
        email: body.email,
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
