"use client";

import { DraggableAttributes, UniqueIdentifier } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { TrashIcon } from "@heroicons/react/24/outline";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

import { useContainerHeader } from "../hooks/useContainerHeader";

type Props = {
  id: UniqueIdentifier;
  handlerDelete: (id: UniqueIdentifier) => void;
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  isDragging?: boolean;
};

export const ContainerHeader = ({
  id,
  listeners,
  attributes,
  isDragging,
  handlerDelete,
}: Props) => {
  const { containerName, handleChange } = useContainerHeader({ id });

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
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
          className="h-5 w-5"
          {...attributes}
          {...listeners}
        />
      </div>
    </div>
  );
};
