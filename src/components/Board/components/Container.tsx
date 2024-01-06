"use client";

import { UniqueIdentifier } from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowsPointingInIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { SortableItem } from "./ContainerItem";
import { useStoreBoard } from "@/app/store";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import { CardForm } from "./Form";

export const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

type Props = {
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

export const Container = ({ id, items, handlerDelete }: Props) => {
  const listElement = useRef<any>();
  const [open, setOpen] = useState(false);
  const [containerName, setContainerName] = useState("");
  const {
    containers,
    setContainers,
    setItems: setData,
    items: data,
    setCards,
    cards,
  } = useStoreBoard();
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
    transform: CSS.Translate.toString(transform && { ...transform, scaleY: 1 }),
    transition,
  };

  const container = containers.find((item) => item.id === id);

  useEffect(() => {
    if (!container) {
      return;
    }

    setContainerName(container.name);
  }, [container]);

  console.log(listElement);

  return (
    <div
      ref={setNodeRef}
      key={id}
      className={`flex flex-col gap-2 w-full bg-slate-900 rounded-xl p-2 h-full ${
        isDragging ? "opacity-50" : ""
      }`}
      style={style}
    >
      <div className="flex justify-between p-2">
        <div className="flex gap-2 items-center">
          <input
            className="bg-slate-900 font-bold"
            type="text"
            value={containerName}
            onChange={(value) => {
              const name = value.target.value;
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
            }}
          />
          <PencilSquareIcon className="h-5 w-5" />
        </div>
        <div className="flex gap-2">
          <TrashIcon
            onClick={() => handlerDelete(id)}
            className="h-5 w-5 text-red-400 cursor-pointer"
          />
          <ArrowsPointingInIcon
            className="h-5 w-5 cursor-grab"
            {...attributes}
            {...listeners}
          />
        </div>
      </div>
      <div ref={listElement} className="flex flex-col gap-2">
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {items?.map((id) => (
            <SortableItem key={id} id={id} />
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
