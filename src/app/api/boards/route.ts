import { HttpStatusCode } from "axios";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { HTTP_NAME_STATUS } from "@/types/http";

import { authOptions } from "../auth/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      logger.info("middleware > invalid session");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.UNAUTHORIZED },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    });

    if (!user) {
      logger.info("middleware > user not found");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.UNAUTHORIZED },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const boards = await prisma.board.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ boards }, { status: HttpStatusCode.Ok });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: HTTP_NAME_STATUS.INTERNAL_SERVER_ERROR },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      logger.info("middleware > invalid session");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.UNAUTHORIZED },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    });

    if (!user) {
      logger.info("middleware > user not found");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.UNAUTHORIZED },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const body = await request.json();

    logger.info(body, "post > board > create");

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

    logger.info("post > board > create > success");

    return NextResponse.json(output, { status: HttpStatusCode.Created });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: HTTP_NAME_STATUS.INTERNAL_SERVER_ERROR },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
