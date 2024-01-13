import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { getOrCreateCursorFor } from "../utils";

const PORT = Number(process.env.SOCKET_PORT ?? 3005);

type SocketClientProps = {
  roomId: string;
};

export const useSocketClient = ({ roomId }: SocketClientProps) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const socket = io(`:${PORT}`, {
      path: `/api/socket`,
      addTrailingSlash: false,
      query: {
        roomId,
      },
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
      await fetch("/api/socket");
    });

    socket.on("receive", (message) => {
      if (message.sender === socket.id) {
        return;
      }

      const cursor = getOrCreateCursorFor(message);

      if (!cursor) {
        return;
      }

      cursor.style.position = "absolute";
      cursor.style.willChange = "transform";

      cursor.style.top = "0px";
      cursor.style.transform = `translate3d(${message.x - 96}px, ${
        message.y - 64
      }px, 0px)`;
    });

    socket.on("disconnect:player", (sender) => {
      console.log(sender);
      const existing = document.querySelector(`[data-sender='${sender}']`);

      if (existing) {
        existing.remove();
      }
    });

    document.body.onmousemove = (event) => {
      const message = { x: event.clientX, y: event.clientY };
      socket.emit("message", message);
    };

    return () => {
      document.body.onmousemove = null;
      socket.disconnect();
    };
  }, []);

  return { loading };
};
