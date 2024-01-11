"use client";

import { useEffect } from "react";

import { useStoreBoard } from "../store";

import { Board } from "./components/board";

export default function Home() {
  const { reset } = useStoreBoard();

  useEffect(() => () => reset(), []);

  return <Board />;
}
