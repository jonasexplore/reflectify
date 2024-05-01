import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { NextResponse } from "next/server";
import type { Server as IOServer } from "socket.io";

type SocketServer = HTTPServer & {
  io?: IOServer;
};

type SocketWithIO = NetSocket & {
  server: SocketServer;
};

export type NextApiResponseWithSocket = NextResponse & {
  socket: SocketWithIO;
};

export enum HTTP_NAME_STATUS {
  UNAUTHORIZED = "Unauthorized",
  NOT_FOUND = "Not found",
  CONFLICT = "Conflict",
  INTERNAL_SERVER_ERROR = "Internal server error",
}
