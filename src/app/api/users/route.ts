import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
  });

  if (!user) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json({ user }, { status: 200 });
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({}, { status: 401 });
    }

    if (!session.user?.email) {
      return NextResponse.json({}, { status: 409 });
    }

    const id = nanoid();

    await prisma.user.create({
      data: {
        id,
        email: session.user?.email,
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
