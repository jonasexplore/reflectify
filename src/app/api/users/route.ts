import { HttpStatusCode } from "axios";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { HTTP_NAME_STATUS } from "@/types/http";

import { authOptions } from "../auth/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      logger.info("get > session > invalid");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.UNAUTHORIZED },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    });

    if (!user) {
      logger.info("get > user > not found");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.NOT_FOUND },
        { status: HttpStatusCode.NotFound }
      );
    }

    return NextResponse.json({ user }, { status: HttpStatusCode.Ok });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: HTTP_NAME_STATUS.INTERNAL_SERVER_ERROR },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      logger.info("get > session > invalid");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.UNAUTHORIZED },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    if (!session.user?.email) {
      logger.info("get > user > invalid email");
      return NextResponse.json(
        { message: HTTP_NAME_STATUS.CONFLICT },
        { status: HttpStatusCode.Conflict }
      );
    }

    const id = nanoid();

    await prisma.user.create({
      data: {
        id,
        email: session.user?.email,
      },
    });

    return NextResponse.json({ id }, { status: HttpStatusCode.Created });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: HTTP_NAME_STATUS.INTERNAL_SERVER_ERROR },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
