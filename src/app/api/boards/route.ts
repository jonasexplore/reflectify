import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextApiRequest) {
  const userId = request.query.userId as string;

  if (!userId) {
    NextResponse.json({}, { status: 404 });
  }

  const boards = await prisma.board.findMany({
    include: { Column: true },
    where: { userId },
  });

  return NextResponse.json({ boards }, { status: 200 });
}

export async function POST(request: NextApiRequest) {
  const { body } = request;

  await prisma.board.create({
    data: {
      id: body.id,
      name: body.name,
      userId: body.userId,
      Column: {
        create: body.columns.map((column: any) => ({
          id: column.id,
          name: column.name,
          position: column.position,
        })),
      },
    },
  });

  return NextResponse.json({}, { status: 201 });
}

export async function PUT(request: NextApiRequest, context: { id: string }) {
  const { body } = request;

  await prisma.board.update({
    data: {
      name: body.name,
      Column: {
        deleteMany: {
          boardId: context.id,
        },
        create: body.columns.map((column: any) => ({
          id: column.id,
          name: column.name,
          position: column.position,
        })),
      },
    },
    where: {
      id: context.id,
    },
  });

  return NextResponse.json({}, { status: 204 });
}
