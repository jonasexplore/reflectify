"use client";

import { DraggableAttributes, UniqueIdentifier } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  DragHandleDots2Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { useContainerHeader } from "../hooks/useContainerHeader";

type Props = {
  id: UniqueIdentifier;
  handlerDelete: (id: UniqueIdentifier) => void;
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  isDragging?: boolean;
  handleNewCard: () => void;
};

export const ContainerHeader = ({
  id,
  listeners,
  attributes,
  isDragging,
  handlerDelete,
  handleNewCard,
}: Props) => {
  const { containerName, handleChange, isCreator } = useContainerHeader({ id });

  return (
    <div className={`flex justify-between p-2`}>
      {!isCreator && (
        <>
          <span className="bg-container font-bold">{containerName}</span>
          <div className="flex gap-2">
            <PlusIcon
              onClick={handleNewCard}
              className="h-5 w-5  cursor-pointer"
            />
          </div>
        </>
      )}
      {isCreator && (
        <>
          <input
            className="bg-container font-bold cursor-text"
            type="text"
            value={containerName}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <button onClick={handleNewCard}>
              <PlusIcon className="h-5 w-5  cursor-pointer" />
            </button>
            <button onClick={() => handlerDelete(id)}>
              <TrashIcon className="h-5 w-5 text-red-400 cursor-pointer" />
            </button>
            <button>
              <DragHandleDots2Icon
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
                className="h-5 w-5"
                {...attributes}
                {...listeners}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
