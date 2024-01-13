"use client";

import { useEffect, useState } from "react";

import { Board } from "../components/board";
import Loading from "../loading";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return isClient ? <Board /> : <Loading />;
}
