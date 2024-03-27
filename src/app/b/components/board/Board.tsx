"use client";

import { DndContext, DragOverlay, MeasuringStrategy } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { PlusIcon } from "@heroicons/react/20/solid";

import { BoardHeader } from "./components/BoardHeader";
import { useBoard } from "./hooks/useBoard";
import { BoardLoaderSkeleton, Container, SortableItem } from "./components";

export const Board = () => {
  const {
    items,
    sensors,
    control,
    onDragCancel,
    handleDragEnd,
    dropAnimation,
    containersIds,
    handleDragOver,
    PLACEHOLDER_ID,
    handleDragStart,
    handleAddColumn,
    loadingSocketClient,
    collisionDetectionStrategy,
  } = useBoard();

  if (control.loading || loadingSocketClient) {
    return <BoardLoaderSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2 flex-1">
      <BoardHeader />
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
        <div id="board" className="relative flex flex-1 gap-1">
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
          {control.active && containersIds.includes(control.active) ? (
            <Container id={control.active} containers={items[control.active]} />
          ) : (
            control.active && <SortableItem id={control.active} />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
