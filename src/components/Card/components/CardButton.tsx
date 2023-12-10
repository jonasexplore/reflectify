"use client";
import React from "react";
import { useCardButton } from "../hooks/useCardButton";

type Props = {
  icon: React.ReactNode;
  showCount?: boolean;
};

export const CardButton = ({ icon, showCount = false }: Props) => {
  const { count, setCount } = useCardButton();

  const onClick = () => {
    if (!showCount) {
      return;
    }

    setCount((prev) => prev + 1);
  };

  return (
    <button
      onClick={onClick}
      className="flex gap-1 items-center text-sm cursor-pointer"
    >
      {icon}
      {showCount && <span>{count}</span>}
    </button>
  );
};
