"use client";

import { useEffect, useState } from "react";

import { withAuth } from "@/components/ui/with-auth";

import { Board } from "../components/board";
import Loading from "../loading";

function BoardId() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return isClient ? <Board /> : <Loading />;
}

export default withAuth(BoardId);
