"use client";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import {
  ChatBubbleIcon,
  HeartFilledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CardProps } from "@/types/board";

import { useCard } from "./hooks/useCard";
import { CardComments } from "./components";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: string;
  card: CardProps;
  handlerDeleteCard?: (id: UniqueIdentifier) => void;
};

export const Card = ({ card, children, handlerDeleteCard }: Props) => {
  const { liked, isOpen, setLiked, setIsOpen, hideCards } = useCard({
    card,
  });

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(value) => setIsOpen(value)}
      className="rounded-md px-3 py-2 flex flex-col gap-2 bg-card"
    >
      <span className={`${hideCards ? "blur-sm" : ""}`}>{children}</span>
      <div className="grid place-items-end">
        <div
          data-no-dnd="true"
          className="flex justify-end items-center gap-4 cursor-default"
        >
          <div className="hidden flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="flex gap-1 items-center text-sm cursor-pointer"
            >
              <span className="text-sm font-semibold">
                {card?.likes?.length}
              </span>
              <HeartFilledIcon
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
              <ChatBubbleIcon className="h-4 w-4" />
            </button>
          </CollapsibleTrigger>
          <button
            onClick={() => handlerDeleteCard?.(card.id)}
            className="flex gap-1 items-center text-sm cursor-pointer"
          >
            <TrashIcon className="h-4 w-4 cursor-pointer text-red-400" />
          </button>
        </div>
      </div>

      <CollapsibleContent
        data-no-dnd="true"
        className="space-y-2 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden cursor-default"
      >
        <CardComments card={card} />
      </CollapsibleContent>
    </Collapsible>
  );
};
