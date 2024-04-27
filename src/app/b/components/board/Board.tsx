"use client";

import { DndContext, DragOverlay, MeasuringStrategy } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import { NotFoundIcon, SocketConnectionErrorIcon } from "@/components/icons";

import { BoardHeader } from "./components/BoardHeader";
import { useBoard } from "./hooks/useBoard";
import { BoardLoaderSkeleton, Container, SortableItem } from "./components";

export const Board = () => {
  const {
    items,
    sensors,
    control,
    hasAccess,
    onDragCancel,
    handleDragEnd,
    dropAnimation,
    containersIds,
    handleDragOver,
    PLACEHOLDER_ID,
    handleDragStart,
    errorSocketClient,
    loadingSocketClient,
    collisionDetectionStrategy,
  } = useBoard();

  if (control.loading) {
    return <BoardLoaderSkeleton />;
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 text-muted-foreground">
        <NotFoundIcon width={256} height={256} />
        <div className="flex flex-col items-center">
          <strong>Oops! Não foi possível acessar o quadro.</strong>
          <span className="text-center">
            Verifique se a URL está correta ou se esse é um quadro de acesso
            público :)
          </span>
        </div>
      </div>
    );
  }

  if (errorSocketClient) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 text-muted-foreground">
        <SocketConnectionErrorIcon width={256} height={256} />
        <div className="flex flex-col items-center">
          <strong>Oops! Tivemos um problema.</strong>
          <span className="text-center">
            Não foi possível realizar uma conexão com o servidor. <br />
            Por favor, tente novamente mais tarde :)
          </span>
        </div>
      </div>
    );
  }

  if (loadingSocketClient) {
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
