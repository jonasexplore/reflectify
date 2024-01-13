"use client";

import { useEffect } from "react";
import { DndContext, DragOverlay, MeasuringStrategy } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { PlusIcon } from "@heroicons/react/20/solid";
import { io } from "socket.io-client";

import { useStoreBoard } from "@/app/store";

import { useBoard } from "./hooks/useBoard";
import { BoardLoaderSkeleton, Container, SortableItem } from "./components";
import { getOrCreateCursorFor } from "./utils";

const PORT = Number(process.env.SOCKET_PORT ?? 3005);

export const Board = () => {
  const {
    items,
    sensors,
    loading,
    activeId,
    onDragCancel,
    handleDragEnd,
    dropAnimation,
    handleDragOver,
    PLACEHOLDER_ID,
    containersIds,
    handleDragStart,
    handleAddColumn,
    collisionDetectionStrategy,
  } = useBoard();
  const { reset } = useStoreBoard();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => reset(), []);

  useEffect(() => {
    const socket = io(`:${PORT}`, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("connect_error", async (err) => {
      console.log(`connect_error due to ${err.message}`);
      // await fetch("/api/socket");
    });

    socket.on("receive", (message) => {
      const cursor = getOrCreateCursorFor(message);

      if (!cursor) {
        return;
      }

      cursor.style.transform = `translate(${message.x}px, ${message.y}px)`;
    });

    document.body.onmousemove = (event) => {
      const message = { x: event.clientX, y: event.clientY };
      socket.emit("message", message);
    };
  }, []);

  if (loading) {
    return <BoardLoaderSkeleton />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={onDragCancel}
      onDragStart={handleDragStart}
      modifiers={[restrictToWindowEdges]}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <div className="h-full flex gap-1">
        <SortableContext
          items={[...containersIds, PLACEHOLDER_ID]}
          strategy={horizontalListSortingStrategy}
        >
          {containersIds.map((container) => (
            <Container
              key={container}
              id={container}
              containers={items[container]}
            />
          ))}
          <div className="flex items-center border border-dashed border-slate-600 rounded-xl mx-2">
            <button
              className="flex flex-col gap-2 justify-center items-center m-2 "
              onClick={handleAddColumn}
            >
              <PlusIcon className="w-4 h-4" /> Adicionar
            </button>
          </div>
        </SortableContext>
      </div>
      <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
        {activeId && containersIds.includes(activeId) ? (
          <Container id={activeId} containers={items[activeId]} />
        ) : (
          activeId && <SortableItem id={activeId} />
        )}
      </DragOverlay>
    </DndContext>
  );
};
