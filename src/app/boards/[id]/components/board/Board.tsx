"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { PlusIcon } from "@heroicons/react/20/solid";
import { MousePointer2, Save } from "lucide-react";
import { useParams } from "next/navigation";

import { updateBoard } from "@/app/services/boards";
import {
  CardProps,
  ContainerProps,
  useStoreAuth,
  useStoreBoard,
} from "@/app/store";
import { Separator } from "@/components/ui/separator";

import { useBoard } from "./hooks/useBoard";
import { useSocketClient } from "./hooks/useSocketClient";
import { BoardLoaderSkeleton, Container, SortableItem } from "./components";

export const Board = () => {
  const { id } = useParams();
  const { loading: loadingSocketClient } = useSocketClient({
    roomId: id as string,
  });
  const {
    items,
    sensors,
    loading,
    activeId,
    boardName,
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
  const { reset, cards, containers } = useStoreBoard();
  const [saveLoading, setSaveLoading] = useState(false);
  const { user } = useStoreAuth();

  const handleUpdate = useCallback(async () => {
    try {
      if (!user?.id) {
        return;
      }

      setSaveLoading(true);

      const cardsToUpdate = Object.keys(items).reduce<
        Array<{
          columnId: UniqueIdentifier;
          id: UniqueIdentifier;
          content: string;
          userId: string;
        }>
      >((acc, curr) => {
        const item = items[curr];
        return acc.concat(
          item.map((id) => {
            const card = cards.find((entry) => entry.id === id) as CardProps;

            return {
              columnId: curr,
              id,
              content: card?.content,
              userId: user.id,
            };
          })
        );
      }, []);

      await updateBoard(id as string, {
        cards: cardsToUpdate,
        columns: containersIds.map((column, index) => {
          const container = containers.find(
            (item) => item.id === column
          ) as ContainerProps;

          return {
            id: container.id,
            name: container.name,
            position: index,
          };
        }),
      });
    } catch (error) {
    } finally {
      setSaveLoading(false);
    }
  }, [cards, containers, containersIds, id, items, user?.id]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  if (loading || loadingSocketClient) {
    return <BoardLoaderSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="flex items-center justify-between gap-3 p-2 rounded-lg">
          <div>
            <span className="text-lg font-bold">{boardName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Salvo automaticamente às 21:34
            </span>
            <button
              className="flex gap-1 p-2 rounded-lg items-center text-sm hover:bg-container transition-all ease-linear delay-100"
              onClick={handleUpdate}
              disabled={saveLoading}
            >
              <Save
                className={`w-4 h-4 ${saveLoading ? "animate-pulse" : ""}`}
              />
              Salvar
            </button>
          </div>
        </div>
        <Separator />
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
        <div id="board" className="relative flex gap-1">
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
