import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { Server, Socket } from "socket.io";

import { NextApiResponseWithSocket } from "@/types/http";

const PORT = Number(process.env.SOCKET_PORT ?? 3005);

export type ClientProps = {
  id: string;
  roomId: string;
  sender?: string;
};

const clients = new Map<Socket, ClientProps>();

export async function GET(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res?.socket?.server?.io) {
    return NextResponse.json(
      {
        success: true,
        message: "Socket is already running",
        socket: `:${PORT}`,
      },
      {
        status: 200,
      }
    );
  }

  console.log("Starting Socket.IO server on port:", PORT);

  const io = new Server({
    path: "/api/socket",
    addTrailingSlash: false,
    cors: { origin: "*" },
  }).listen(PORT);

  io.on("connect", (socket) => {
    const roomId = socket.handshake.query.roomId as string;
    console.log("socket connect", socket.id, "at", roomId);
    socket.broadcast.emit("welcome", `Welcome ${socket.id}`);

    const metadata = {
      id: socket.id,
      roomId,
    };

    socket.join(roomId);
    clients.set(socket, metadata);

    socket.on("disconnect", async () => {
      const client = clients.get(socket);

      if (client) {
        socket.to(client.roomId).emit("disconnect:player", client?.id);
      }

      console.log("socket disconnect", socket.id);
      clients.delete(socket);
    });
  });

  Object.assign(res, { socket: { server: { io } } });

  return NextResponse.json(
    {
      success: true,
      message: "Socket is started",
      socket: `:${PORT}`,
    },
    {
      status: 201,
    }
  );
}
