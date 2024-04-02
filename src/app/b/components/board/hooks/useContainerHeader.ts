import { ChangeEvent, useEffect, useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

import { useStoreAuth, useStoreBoard } from "@/store";

type Props = {
  id: UniqueIdentifier;
};

export const useContainerHeader = ({ id }: Props) => {
  const { user } = useStoreAuth();
  const { containers, set, socket, board } = useStoreBoard();
  const [containerName, setContainerName] = useState("");

  const isCreator = user?.id === board.userId;
  const container = containers.find((item) => item.id === id);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const name = event.target.value;
    setContainerName(name);

    if (container) {
      const update = {
        containers: containers?.map((item) => {
          if (item.name === container.name) {
            return {
              ...item,
              name,
            };
          }

          return item;
        }),
      };

      set(update);
      socket?.emit("update:board", JSON.stringify(update));
    }
  }

  useEffect(() => {
    if (!container) {
      return;
    }

    setContainerName(container.name);
  }, [container]);

  return { containerName, handleChange, isCreator };
};
