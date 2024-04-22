import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { io } from "socket.io-client";

const PORT = Number(process.env.SOCKET_PORT ?? 3005);

export const useSocketClient = ({ set, board }: any) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!board.id) {
      return;
    }

    const client = io(`:${PORT}`, {
      path: `/api/socket`,
      addTrailingSlash: false,
      query: { roomId: board.id },
    });

    set({ socket: client });

    client.on("connect", () => {
      setLoading(false);

      client.on("update:board_updated", (payload) => {
        const result = JSON.parse(payload);

        unstable_batchedUpdates(() => {
          set(result);
        });
      });
    });

    client.on("disconnect", () => {});

    client.on("connect_error", async (err) => {
      console.log(`connect_error due to ${err.message}`);
      try {
        await fetch("/api/socket");
      } catch (error) {
        return;
      }
    });

    return () => {
      client.disconnect();
    };
  }, [board.id, set]);

  return { loading };
};
