import { useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";
import * as z from "zod";

import { toast } from "@/components/ui/use-toast";
import { useStoreBoard } from "@/store";

type Props = {
  id: UniqueIdentifier;
  containers: UniqueIdentifier[];
};

export const useContainer = ({ id, containers }: Props) => {
  const [open, setOpen] = useState(false);
  const { addCard, removeCard, containersIds, removeContainer } =
    useStoreBoard();

  const {
    setNodeRef,
    transition,
    transform,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id,
    data: { type: "container", children: containers },
    animateLayoutChanges: (args) =>
      defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
  });

  const formSchema = z.object({
    message: z
      .string()
      .min(2, "A mensagem deve ter pelo menos 2 caracteres")
      .max(512, "A mesagem deve ter no máximo 512 caracteres"),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addCard(id, {
      columnId: id,
      comments: [],
      id: nanoid(),
      likes: [],
      content: values.message,
    });

    setOpen(false);
  }

  function handlerDelete(containerId: UniqueIdentifier) {
    if (containersIds.length <= 1) {
      toast({
        title: "Ação não permitida",
        description: "Pelo menos uma coluna deve existir",
      });
      return;
    }

    removeContainer(containerId);
  }

  function handlerDeleteCard(cardId: UniqueIdentifier) {
    removeCard(id, cardId);
  }

  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
  };

  return {
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
  };
};
