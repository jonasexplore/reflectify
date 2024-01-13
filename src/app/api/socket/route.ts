import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { Server, Socket } from "socket.io";

import { NextApiResponseWithSocket } from "@/app/types/http";

const PORT = Number(process.env.SOCKET_PORT ?? 3005);

export type ClientProps = {
  id: string;
  sender?: string;
};

const clients = new Map<Socket, ClientProps>(new Set());

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
    console.log("socket connect", socket.id);
    socket.broadcast.emit("welcome", `Welcome ${socket.id}`);

    const metadata = { id: socket.id };

    clients.set(socket, metadata);

    socket.on("message", (message: ClientProps) => {
      const metadata = clients.get(socket);

      if (!metadata) {
        return;
      }

      message.sender = metadata?.id;

      [...Array.from(clients.keys())].forEach((client) => {
        client.emit("receive", message);
      });
    });

    socket.on("disconnect", async () => {
      clients.delete(socket);
      console.log("socket disconnect");
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
