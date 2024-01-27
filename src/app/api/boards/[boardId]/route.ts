import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  context: { params: { boardId: string } }
) {
  try {
    const boardId = context.params.boardId;

    if (!boardId) {
      return NextResponse.json({}, { status: 404 });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          include: {
            cards: {
              include: {
                likes: true,
                comments: true,
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
  } catch (error) {
    console.log({ error });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { boardId: string } }
) {
  try {
    const body = await request.json();

    const { columns, cards } = body;

    const { boardId } = context.params;

    await prisma.card.deleteMany({ where: { boardId } });
    await prisma.boardColumn.deleteMany({ where: { boardId } });
    await Promise.all(
      columns.map((column: any) =>
        prisma.boardColumn.create({
          data: {
            boardId,
            id: column.id,
            name: column.name,
            position: column.position,
          },
        })
      )
    );
    await Promise.all(
      cards.map((card: any) =>
        prisma.card.create({
          data: {
            boardId,
            id: card.id,
            userId: card.userId,
            columnId: card.columnId,
            content: card.content,
          },
        })
      )
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
