import { useCallback } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";

import { toast } from "@/components/ui/use-toast";
import { useStoreAuth, useStoreBoard } from "@/store";
import { createQueryString } from "@/utils/create-query-string";

type Props = {
  id: UniqueIdentifier;
  containers: UniqueIdentifier[];
};

export const useContainer = ({ id, containers }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const open = Boolean(searchParams.get("newMessageModalIsOpen"));
  const containerId = searchParams.get("c") as UniqueIdentifier;
  const boardId = searchParams.get("id") as string;
  const { user } = useStoreAuth();
  const {
    set,
    items,
    cards,
    removeCard,
    containersIds,
    removeContainer,
    socket,
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

  const setOpen = useCallback(
    (value: boolean) => {
      router.push(
        `${pathname}?${createQueryString(
          searchParams,
          ["c", "newMessageModalIsOpen"],
          [value ? String(id) : null, value ? String(value) : null]
        )}`
      );
    },
    [id, pathname, router, searchParams]
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!containersIds.includes(containerId)) {
      toast({
        title: "Algo deu errado!",
        description:
          "Parece que a coluna que você está tentando adicionar não existe mais.",
      });

      return;
    }

    const card = {
      boardId,
      likes: [],
      comments: [],
      id: nanoid(),
      columnId: containerId,
      content: values.message,
      userId: user?.id as string,
    };

    const update = {
      cards: [...cards, card],
      items: { ...items, [containerId]: [...items[containerId], card.id] },
    };

    set(update);
    socket?.emit("update:board", JSON.stringify(update));

    router.push(
      `${pathname}?${createQueryString(
        searchParams,
        ["c", "newMessageModalIsOpen"],
        [null, null]
      )}`
    );
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
