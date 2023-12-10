"use client";
import { Card } from "@/components/Card";
import { useBoardList } from "../hooks/useBoardList";

type BoardListProps = {
  title: string;
  cards: Array<{
    id: string;
    text: string;
  }>;
  listIndex: number;
};

export const BoardList = ({ title, cards, listIndex }: BoardListProps) => {
  const { ref } = useBoardList({ listIndex });

  return (
    <div className="flex flex-col gap-4 mb-2">
      <span>{title}</span>
      <div>
        <ul className="flex flex-col gap-4">
          {cards.map((card, index) => (
            <li key={card.id} className="cursor-grab">
              <Card listIndex={listIndex} index={index}>
                {card.text}
              </Card>
            </li>
          ))}
          <li
            ref={ref}
            className="cursor-pointer rounded border border-dashed p-4"
          >
            Add card
          </li>
        </ul>
      </div>
    </div>
  );
};
