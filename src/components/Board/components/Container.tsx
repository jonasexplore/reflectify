"use client";

import { UniqueIdentifier } from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SortableItem } from "./ContainerItem";
import { useStoreBoard } from "@/app/store";
import { DetailedHTMLProps, HTMLAttributes, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import { CardForm } from "./Form";
import { ContainerHeader } from "./ContainerHeader";

export const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

type Props = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "id"
> & {
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  handlerDelete: any;
};

const formSchema = z.object({
  message: z
    .string()
    .min(2, "A mensagem deve ter pelo menos 2 caracteres")
    .max(512, "A mesagem deve ter no máximo 512 caracteres"),
});

export const Container = ({ id, items, handlerDelete, ...props }: Props) => {
  const listElement = useRef<any>();
  const [open, setOpen] = useState(false);
  const { setItems: setData, items: data, setCards, cards } = useStoreBoard();
  const {
    setNodeRef,
    transition,
    transform,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "container",
      children: items,
    },
    animateLayoutChanges,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const cardId = window.crypto.randomUUID() as UniqueIdentifier;

    setData({ ...data, [id]: [...data[id], cardId] });
    setCards([
      ...cards,
      {
        comments: [],
        id: cardId as string,
        likes: [],
        content: values.message,
      },
    ]);

    setOpen(false);
  }

  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
  };

  return (
    <div
      {...props}
      ref={setNodeRef}
      key={id}
      className={`flex flex-col gap-2 w-full bg-container rounded-xl p-2 h-full ${props.className}`}
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
      <div ref={listElement} className="flex flex-col gap-2">
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items?.map((id) => (
            <SortableItem className="cursor-grab" key={id} id={id} />
          ))}
        </SortableContext>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 justify-center cursor-pointer rounded-xl border border-dashed p-4 border-slate-300"
      >
        <PlusIcon className="w-4 h-4" />
        Adicionar
      </button>

      <Dialog onOpenChange={(value) => setOpen(value)} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo card</DialogTitle>
            <DialogDescription>
              <CardForm onSubmit={onSubmit} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
