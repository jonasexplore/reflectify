import React from "react";

import { CardFooter } from "./components/CardFooter";

type Props = {
  children: React.ReactNode;
};

export const Card = ({ children }: Props) => {
  return (
    <div className="rounded-xl p-2 flex flex-col gap-2 bg-slate-50 border-slate-200 border">
      <div>
        <div>{children}</div>
        <CardFooter />
      </div>
    </div>
  );
};
