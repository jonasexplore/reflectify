"use client";

import { useEffect } from "react";
import { DndContext, DragOverlay, MeasuringStrategy } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { MousePointer2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useStoreBoard } from "@/app/store";

import { useBoard } from "./hooks/useBoard";
import { useSocketClient } from "./hooks/useSocketClient";
import { BoardLoaderSkeleton, Container, SortableItem } from "./components";

export const Board = () => {
  const router = useRouter();
  const { id } = useParams();
  const { loading: loadingSocketClient } = useSocketClient({
    roomId: id as string,
  });
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

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  if (loading || loadingSocketClient) {
    return <BoardLoaderSkeleton />;
  }

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="mb-4">
        <button
          className="font-bold flex gap-2 items-center"
          onClick={() => router.push("/boards")}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Voltar
        </button>
      </div>
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
        <div id="board" className="relative h-full flex gap-1">
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

        <template id="cursor">
          <div className="flex flex-col items-center">
            <MousePointer2 className="w-4 h-4" />
            <span className="text-[12px] font-bold"></span>
          </div>
        </template>
      </DndContext>
    </div>
  );
};
