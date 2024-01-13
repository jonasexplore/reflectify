import { useEffect } from "react";
import { io } from "socket.io-client";

import { getOrCreateCursorFor } from "../utils";

const PORT = Number(process.env.SOCKET_PORT ?? 3005);

export const useSocketClient = () => {
  useEffect(() => {
    const socket = io(`:${PORT}`, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("disconnect", () => {
      const existing = document.querySelector(`[data-sender='${socket.id}']`);
      if (existing) {
        existing.remove();
      }
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

    document.body.onmousemove = (event) => {
      const message = { x: event.clientX, y: event.clientY };
      socket.emit("message", message);
    };

    return () => {
      document.body.onmousemove = null;
    };
  }, []);
};
