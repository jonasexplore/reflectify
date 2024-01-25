import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  context: { params: { boardId: string } }
) {
  const boardId = context.params.boardId;

  if (!boardId) {
    return NextResponse.json({}, { status: 404 });
  }

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      Column: {
        include: {
          Card: {
            include: {
              Like: true,
              Comment: true,
            },
          },
        },
      },
    },
  });

  if (!board) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(board, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  context: { params: { boardId: string } }
) {
  const body = await request.json();

  await prisma.board.update({
    data: {
      name: body.name,
      Column: {
        deleteMany: {
          boardId: context.params.boardId,
        },
        create: body.columns.map((column: any) => ({
          id: column.id,
          name: column.name,
          position: column.position,
        })),
      },
    },
    where: {
      id: context.params.boardId,
    },
  });

  return NextResponse.json({}, { status: 204 });
}
