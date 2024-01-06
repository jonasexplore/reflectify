import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Container } from "./components/Container";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useBoard } from "./hooks/useBoard";
import { SortableItem } from "./components/ContainerItem";

export const Board = () => {
  const {
    items,
    sensors,
    activeId,
    onDragCancel,
    handlerDelete,
    handleDragEnd,
    handleDragOver,
    PLACEHOLDER_ID,
    containersNames,
    handleDragStart,
    handleAddColumn,
    collisionDetectionStrategy,
  } = useBoard();

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
          items={[...containersNames, PLACEHOLDER_ID]}
          strategy={horizontalListSortingStrategy}
        >
          {containersNames.map((container) => (
            <Container
              handlerDelete={handlerDelete}
              key={container}
              id={container}
              items={items[container]}
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
      <DragOverlay
        adjustScale={false}
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}
      >
        {activeId && containersNames.includes(activeId) ? (
          <Container
            handlerDelete={handlerDelete}
            id={activeId}
            items={items[activeId]}
          />
        ) : (
          activeId && <SortableItem id={activeId} />
        )}
      </DragOverlay>
    </DndContext>
  );
};
