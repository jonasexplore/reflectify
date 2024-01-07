import { useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as z from "zod";

import { useStoreBoard } from "@/app/store";
import { toast } from "@/components/ui/use-toast";

type Props = {
  id: UniqueIdentifier;
  containers: UniqueIdentifier[];
};

export const useContainer = ({ id, containers }: Props) => {
  const [open, setOpen] = useState(false);
  const {
    items,
    addCard,
    setItems,
    removeCard,
    containers: containerState,
    setContainers,
    containersIds,
    setContainersIds,
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
      comments: [],
      id: window.crypto.randomUUID(),
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

    setContainersIds(containersIds.filter((id) => id !== containerId));
    setContainers(containerState.filter((item) => item.id !== containerId));
    delete items[containerId];
    setItems(items);
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
