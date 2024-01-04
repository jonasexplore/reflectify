"use client";
import { useState } from "react";

const listMock = {
  root: [
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
  container1: [
    {
      id: "4",
      text: "we spent a lot of time",
    },
  ],
  container2: [
    {
      id: "5",
      text: "do something",
    },
    {
      id: "6",
      text: "improve your vocabulary",
    },
  ],
};

export const useBoard = () => {
  const [items, setItems] = useState(listMock);

  return { items, setItems };
};
