import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  _: NextRequest,
  context: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    });

    if (!user) {
      return NextResponse.json(null, { status: 404 });
    }

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
      return NextResponse.json(null, { status: 404 });
    }

    if (!board.isPublic && user.id !== board.userId) {
      return NextResponse.json(null, { status: 401 });
    }

    const response = {
      ...board,
      columns: board.columns.toSorted((a, b) => a.position - b.position),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log({ error });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json(null, { status: 404 });
    }

    if (!board.isPublic) {
      const session = await getServerSession(authOptions);

      if (!session) {
        return NextResponse.json(null, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
      });

      if (!user) {
        return NextResponse.json(null, { status: 401 });
      }

      if (user.id !== board.userId) {
        return NextResponse.json(null, { status: 401 });
      }
    }

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
