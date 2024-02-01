import { ChangeEvent, useEffect, useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

import { useStoreBoard } from "@/app/store";

type Props = {
  id: UniqueIdentifier;
};

export const useContainerHeader = ({ id }: Props) => {
  const { containers, setContainers } = useStoreBoard();
  const [containerName, setContainerName] = useState("");

  const container = containers.find((item) => item.id === id);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const name = event.target.value;
    setContainerName(name);

    if (container) {
      const newContainers = containers?.map((item) => {
        if (item.name === container.name) {
          return {
            ...item,
            name,
          };
        }

        return item;
      });

      setContainers(newContainers);
    }
  }

  useEffect(() => {
    if (!container) {
      return;
    }

    setContainerName(container.name);
  }, [container]);

  return { containerName, handleChange };
};
