import { useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { io } from "socket.io-client";

import { BoardProps } from "@/types/board";

type Props = {
  set: (value: Record<string, unknown>) => void;
  board: Pick<BoardProps, "id" | "name" | "userId">;
  hasAccess: boolean;
};

export const useSocketClient = ({ set, board, hasAccess }: Props) => {
  const MAX_ATTEMPTS = 3;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const socketInitializer = useCallback(async () => {
    if (!board.id || !hasAccess) {
      return;
    }

    setError(false);

    let attempts = 0;

    const client = io(process.env.SOCKET_API_URL ?? "", {
      path: "/api/socket",
      reconnectionAttempts: MAX_ATTEMPTS,
      query: { roomId: board.id },
    });

    set({ socket: client });

    client.on("connect", () => {
      setLoading(false);
      client.on("update:board_updated", (payload) => {
        const result = JSON.parse(payload);

        unstable_batchedUpdates(() => set(result));
      });
    });

    client.on("disconnect", () => {});

    client.io.on("reconnect_attempt", (attempt) => {
      attempts = attempt;
    });

    client.io.on("reconnect_failed", () => {
      if (attempts === MAX_ATTEMPTS) {
        setError(true);
      }
    });

    return () => {
      client.disconnect();
    };
  }, [board.id, hasAccess, set]);

  useEffect(() => {
    socketInitializer();
  }, [socketInitializer]);

  return { loading, error };
};
