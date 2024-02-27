import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const PORT = Number(process.env.SOCKET_PORT ?? 3005);

type SocketClientProps = {
  roomId: string;
};

export const useSocketClient = ({ roomId }: SocketClientProps) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!roomId) {
      return;
    }

    const socket = io(`:${PORT}`, {
      path: `/api/socket`,
      addTrailingSlash: false,
      query: { roomId },
    });

    socket.on("connect", () => {
      console.log("Connected");
      setLoading(false);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("connect_error", async (err) => {
      console.log(`connect_error due to ${err.message}`);
      try {
        await fetch("/api/socket");
      } catch (error) {
        return;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return { loading };
};
