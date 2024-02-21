"use client";

import { DetailedHTMLProps, HTMLAttributes } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusIcon } from "@heroicons/react/24/outline";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useContainer } from "../hooks/useContainer";

import { CardForm, ContainerHeader, SortableItem } from ".";

type Props = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "id"
> & {
  id: UniqueIdentifier;
  containers: UniqueIdentifier[];
};

export const Container = ({ id, containers, ...props }: Props) => {
  const {
    open,
    style,
    setOpen,
    onSubmit,
    listeners,
    attributes,
    isDragging,
    setNodeRef,
    handlerDelete,
    handlerDeleteCard,
  } = useContainer({ id, containers });

  return (
    <div
      {...props}
      ref={setNodeRef}
      className={`flex flex-col gap-2 w-full bg-container rounded-xl p-2 ${
        props.className ?? ""
      }`}
      style={{
        ...style,
        ...props.style,
        opacity: isDragging ? "0.5" : undefined,
      }}
    >
      <ContainerHeader
        id={id}
        listeners={listeners}
        isDragging={isDragging}
        attributes={attributes}
        handlerDelete={handlerDelete}
      />
      <button
        onClick={() => setOpen(true)}
        className="flex gap-2 items-center justify-center cursor-pointer rounded-xl border border-dashed p-4 border-slate-300"
      >
        <PlusIcon className="w-4 h-4" />
        Adicionar
      </button>

      <div className="flex flex-col gap-2">
        <SortableContext
          items={containers}
          strategy={verticalListSortingStrategy}
        >
          {containers?.map((id) => (
            <SortableItem
              handlerDeleteCard={handlerDeleteCard}
              className="cursor-grab"
              key={id}
              id={id}
            />
          ))}
        </SortableContext>
      </div>

      <Dialog onOpenChange={(value) => setOpen(value)} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo card</DialogTitle>
            <div>
              <CardForm onSubmit={onSubmit} />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
