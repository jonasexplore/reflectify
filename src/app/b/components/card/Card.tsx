"use client";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { DraggableAttributes, UniqueIdentifier } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { HeartIcon } from "@heroicons/react/20/solid";
import { ChatBubbleOvalLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CardProps } from "@/types/board";

import { useCard } from "./hooks/useCard";
import { CardComments } from "./components";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: React.ReactNode;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  card: CardProps;
  handlerDeleteCard?: (id: UniqueIdentifier) => void;
};

export const Card = ({
  card,
  children,
  listeners,
  attributes,
  handlerDeleteCard,
}: Props) => {
  const { liked, isOpen, setLiked, setIsOpen, isCreator } = useCard({
    card,
  });

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(value) => setIsOpen(value)}
      className="rounded-xl p-2 flex flex-col gap-2 bg-card"
    >
      <div className="break-all">{children}</div>
      <div className="flex justify-end items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="flex gap-1 items-center text-sm cursor-pointer"
          >
            <HeartIcon
              className={
                liked
                  ? "w-4 h-4 text-red-500 transition-colors ease-in-out"
                  : "w-4 h-4"
              }
            />
          </button>
        </div>
        <CollapsibleTrigger asChild>
          <button className="flex gap-1 items-center text-sm cursor-pointer">
            <span className="text-sm font-semibold">
              {card?.comments?.length}
            </span>
            <ChatBubbleOvalLeftIcon className="h-4 w-4" />
          </button>
        </CollapsibleTrigger>
        {isCreator && (
          <button
            onClick={() => handlerDeleteCard?.(card.id)}
            className="flex gap-1 items-center text-sm cursor-pointer"
          >
            <TrashIcon className="h-4 w-4 cursor-pointer text-red-400" />
          </button>
        )}
        <button
          className="flex gap-1 items-center text-sm cursor-grab"
          onClick={() => setIsOpen(false)}
          {...attributes}
          {...listeners}
        >
          <DragHandleDots2Icon className="h-4 w-4" />
        </button>
      </div>

      <CollapsibleContent className="space-y-2 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
        <CardComments card={card} />
      </CollapsibleContent>
    </Collapsible>
  );
};
