"use client";
import { produce } from "immer";
import { useState } from "react";

const listMock = [
  {
    id: "list1",
    title: "Went well",
    cards: [
      {
        id: "1",
        text: "hello world",
      },
      {
        id: "2",
        text: "nice to meet you",
      },
      {
        id: "3",
        text: "you are welcome",
      },
    ],
  },
  {
    id: "list2",
    title: "To improve",
    cards: [
      {
        id: "4",
        text: "we spent a lot of time",
      },
    ],
  },
  {
    id: "list3",
    title: "Action items",
    cards: [
      {
        id: "5",
        text: "do something",
      },
      {
        id: "6",
        text: "improve your vocabulary",
      },
    ],
  },
];

export const useBoard = () => {
  const [lists, setLists] = useState(listMock);

  function moveCard(
    fromList: number,
    toList: number,
    from: number,
    to: number
  ) {
    setLists(
      produce(lists, (draft) => {
        const dragged = draft[fromList].cards[from];

        draft[fromList].cards.splice(from, 1);
        draft[toList].cards.splice(to, 0, dragged);
      })
    );
  }

  function deleteCard(listIndex: number, cardIndex: number) {
    setLists(
      produce(lists, (draft) => {
        draft[listIndex].cards.splice(cardIndex, 1);
      })
    );
  }

  return { lists, moveCard, deleteCard };
};
