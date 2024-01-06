"use client";

import { useStoreBoard } from "@/app/store";
import { DraggableAttributes, UniqueIdentifier } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { TrashIcon } from "@heroicons/react/24/outline";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { ChangeEvent, useEffect, useState } from "react";

type Props = {
  id: UniqueIdentifier;
  handlerDelete: (id: UniqueIdentifier) => void;
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  isDragging?: boolean;
};

export const ContainerHeader = ({
  id,
  handlerDelete,
  attributes,
  listeners,
  isDragging,
}: Props) => {
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
        } else {
          return item;
        }
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

  return (
    <div className={`flex justify-between p-2`}>
      <input
        className="bg-container font-bold cursor-text"
        type="text"
        value={containerName}
        onChange={handleChange}
      />
      <div className="flex gap-2">
        <TrashIcon
          onClick={() => handlerDelete(id)}
          className="h-5 w-5 text-red-400 cursor-pointer"
        />
        <DragHandleDots2Icon
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
          className="h-5 w-5"
          {...attributes}
          {...listeners}
        />
      </div>
    </div>
  );
};
