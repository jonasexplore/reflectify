"use client";
import { useState } from "react";

export const useCardButton = () => {
  const [count, setCount] = useState<number>(0);

  return { count, setCount };
};
