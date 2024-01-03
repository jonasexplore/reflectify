"use client";
import React from "react";
import { useCardButton } from "../hooks/useCardButton";

type Props = {
  icon: React.ReactNode;
  showCount?: boolean;
  count?: number;
  onClick?: () => void;
};

export const CardButton = ({
  icon,
  count,
  onClick,
  showCount = false,
}: Props) => {
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
