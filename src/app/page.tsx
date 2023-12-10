"use client";
import { Board } from "@/components/Board";
import { Navbar } from "@/components/Navbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <main className="flex flex-col gap-4 mx-4 mt-4">
        <Navbar />
        <Board />
      </main>
    </DndProvider>
  );
}
