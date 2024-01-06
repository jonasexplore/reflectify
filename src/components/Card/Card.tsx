"use client";
import React, { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import dayjs from "dayjs";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Textarea } from "../ui/textarea";
import { CardProps, useStoreBoard } from "@/app/store";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Send } from "lucide-react";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: React.ReactNode;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  cardInfo?: CardProps;
};

export const Card = ({
  children,
  attributes,
  listeners,
  className,
  cardInfo,
}: Props) => {
  const { cards, setCards } = useStoreBoard();
  const [isOpen, setIsOpen] = React.useState(false);
  const [comment, setComment] = useState("");

  function handleComment() {
    setCards(
      cards.map((card) => {
        if (card.id !== cardInfo?.id) {
          return card;
        }

        return {
          ...card,
          comments: [
            ...card.comments,
            {
              content: comment,
              id: window.crypto.randomUUID(),
              likes: [],
              timesteamp: new Date().toISOString(),
              userId: window.crypto.randomUUID(),
            },
          ],
        };
      })
    );
    setComment("");
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(value) => setIsOpen(value)}
      className="rounded-xl p-2 flex flex-col gap-2 bg-card"
    >
      <div className={className}>{children}</div>
      <div className="flex justify-end items-center gap-4">
        <div className="flex gap-2">
          <button className="flex gap-1 items-center text-sm cursor-pointer">
            <HeartIcon className="h-4 w-4" />
          </button>
        </div>
        <CollapsibleTrigger asChild>
          <button className="flex gap-1 items-center text-sm cursor-pointer">
            <span className="text-sm font-semibold">
              {cardInfo?.comments?.length}
            </span>
            <ChatBubbleOvalLeftIcon className="h-4 w-4" />
          </button>
        </CollapsibleTrigger>
        <button className="flex gap-1 items-center text-sm cursor-pointer">
          <TrashIcon className="h-4 w-4 cursor-pointer text-red-400" />
        </button>
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
        <strong className="text-sm">Comentários</strong>
        <div className="m-1 flex flex-col gap-2">
          <Textarea
            rows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="max-h-[256px]"
            placeholder="Digite sua mensagem aqui."
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleComment}>
              <span className="flex gap-2 items-center">
                <Send className="h-4 w-4" />
                Comentar
              </span>
            </Button>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {cardInfo?.comments?.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col gap-4 rounded-2xl bg-container p-2"
            >
              <div className="flex gap-4 items-start">
                <Avatar>
                  <AvatarFallback>JB</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="text-sm">{comment.content}</span>
                  <div className="flex justify-end items-center gap-2">
                    <span className="text-sm">
                      {dayjs(comment.timesteamp).format("HH:mm")}
                    </span>
                    <span className="text-sm font-semibold">
                      {comment.likes.length}
                    </span>
                    <button className="flex gap-1 items-center text-sm cursor-pointer">
                      <HeartIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};
