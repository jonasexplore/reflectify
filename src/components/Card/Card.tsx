import React from "react";

import { CardFooter } from "./components/CardFooter";

type Props = {
  children: React.ReactNode;
};

export const Card = ({ children }: Props) => {
  return (
    <div className="rounded p-2 flex flex-col gap-2 bg-slate-900">
      <div>
        <div>{children}</div>
        <CardFooter />
      </div>
    </div>
  );
};
