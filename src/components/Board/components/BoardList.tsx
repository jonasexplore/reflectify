"use client";
import { Card } from "@/components/Card";
import { useBoardList } from "../hooks/useBoardList";
import { Container, Draggable } from "react-smooth-dnd";

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
    <div ref={ref} className="flex flex-col gap-4 mb-2 h-screen">
      <span>{title}</span>
      <div>
        <Container
          onDrop={(params) => {
            console.log(params);
          }}
        >
          {cards.map((item, index) => {
            return (
              <Draggable key={item.id}>
                <Card listIndex={listIndex} index={index}>
                  {item?.text}
                </Card>
              </Draggable>
            );
          })}
        </Container>
        <ul className="flex flex-col gap-4">
          {/* <li className="cursor-pointer rounded border border-dashed p-4">
            Add card
          </li> */}
          {/* {cards.map((card, index) => (
            <li key={card?.id} className="cursor-grab">
              <Card listIndex={listIndex} index={index}>
                {card?.text}
              </Card>
            </li>
          ))} */}
        </ul>
      </div>
    </div>
  );
};
