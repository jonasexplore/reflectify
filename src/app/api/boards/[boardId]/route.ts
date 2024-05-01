import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { HTTP_NAME_STATUS } from "@/types/http";

import { authOptions } from "../../auth/options";

export async function GET(
  _: NextRequest,
  context: { params: { boardId: string } }
) {
  try {
    const boardId = context.params.boardId;
    logger.info(`get > board > ${boardId}`);

    if (!boardId) {
      logger.info(`get > boardId > invalid`);
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.CONFLICT },
        { status: HttpStatusCode.Conflict }
      );
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
      logger.info(`get > board > not found`);
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.NOT_FOUND },
        { status: HttpStatusCode.NotFound }
      );
    }

    if (!board.isPublic) {
      const output = await validateUserPermissions(board.userId);

      if (output !== undefined) {
        return output;
      }
    }

    const response = {
      ...board,
      columns: board.columns.toSorted((a, b) => a.position - b.position),
    };

    return NextResponse.json(response, { status: HttpStatusCode.Ok });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: HTTP_NAME_STATUS.INTERNAL_SERVER_ERROR },
      { status: HttpStatusCode.InternalServerError }
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
      logger.info("put > board > not found");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.NOT_FOUND },
        { status: HttpStatusCode.NotFound }
      );
    }

    if (!board.isPublic) {
      const output = await validateUserPermissions(board.userId);

      if (output !== undefined) {
        return output;
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

    return new Response(null, { status: HttpStatusCode.NoContent });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: HTTP_NAME_STATUS.INTERNAL_SERVER_ERROR },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { boardId: string } }
) {
  try {
    const output = await getUser();

    if (output instanceof NextResponse) {
      return output;
    }

    const boardId = context.params.boardId;

    if (!boardId) {
      logger.info("patch > board > invalid boardId");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.CONFLICT },
        { status: HttpStatusCode.Conflict }
      );
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      logger.info("patch > board > not found");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.NOT_FOUND },
        { status: HttpStatusCode.NotFound }
      );
    }

    if (output.id !== board.userId) {
      logger.info("patch > board > unauthorized");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.UNAUTHORIZED },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const body = await request.json();

    board.name = body.name;
    board.isPublic = body.isPublic;

    await prisma.board.update({
      data: board,
      where: { id: board.id },
    });

    return new Response(null, { status: HttpStatusCode.NoContent });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: HTTP_NAME_STATUS.INTERNAL_SERVER_ERROR },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  context: { params: { boardId: string } }
) {
  try {
    const output = await getUser();

    if (output instanceof NextResponse) {
      return output;
    }

    const boardId = context.params.boardId;

    if (!boardId) {
      logger.info(`delete > boardId > invalid`);
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.CONFLICT },
        { status: HttpStatusCode.Conflict }
      );
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      logger.info(`delete > board > not found`);
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.NOT_FOUND },
        { status: HttpStatusCode.NotFound }
      );
    }

    if (output.id !== board.userId) {
      logger.info(`delete > board > unauthorized`);
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.UNAUTHORIZED },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    await prisma.card.deleteMany({ where: { boardId } });
    await prisma.boardColumn.deleteMany({ where: { boardId } });
    await prisma.board.delete({ where: { id: boardId } });

    return new Response(null, { status: HttpStatusCode.NoContent });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: HTTP_NAME_STATUS.INTERNAL_SERVER_ERROR },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

async function getUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    logger.info("put > session > invalid");
    return NextResponse.json(
      { message: HTTP_NAME_STATUS.UNAUTHORIZED },
      { status: HttpStatusCode.Unauthorized }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
  });

  if (!user) {
    logger.info("put > user > not found");
    return NextResponse.json(
      { message: HTTP_NAME_STATUS.UNAUTHORIZED },
      { status: HttpStatusCode.Unauthorized }
    );
  }

  return user;
}

async function validateUserPermissions(userIdFromBoard: string) {
  const output = await getUser();

  if (output instanceof NextResponse) {
    return output;
  }

  if (output.id !== userIdFromBoard) {
    logger.info("put > board > unauthorized");
    return NextResponse.json(
      { message: HTTP_NAME_STATUS.UNAUTHORIZED },
      { status: HttpStatusCode.Unauthorized }
    );
  }
}
