import { DndContext, DragOverlay, MeasuringStrategy } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { PlusIcon } from "@heroicons/react/20/solid";

import { useBoard } from "./hooks/useBoard";
import { BoardLoaderSkeleton, Container, SortableItem } from "./components";

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
