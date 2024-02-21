"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import {
  closestCenter,
  CollisionDetection,
  defaultDropAnimationSideEffects,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { getBoard, updateBoard } from "@/services/boards";
import {
  CardProps,
  ContainerProps,
  ItemsProps,
  useStoreAuth,
  useStoreBoard,
} from "@/store";

export const TRASH_ID = "void";
const PLACEHOLDER_ID = "placeholder";

type HandleDragItemProps = {
  over: DragOverEvent["over"];
  overId: UniqueIdentifier;
  active: DragOverEvent["active"];
  overContainer: UniqueIdentifier;
  activeContainer: UniqueIdentifier;
};

export const useBoard = () => {
  const { toast } = useToast();
  const {
    items,
    cards,
    reset,
    setItems,
    fillBoard,
    containers,
    setContainers,
    containersIds,
    setContainersIds,
  } = useStoreBoard();
  const params = useParams();
  const router = useRouter();
  const { id } = useParams();
  const { user } = useStoreAuth();

  const addedFirstColumn = useRef(false);
  const recentlyMovedToNewContainer = useRef(false);
  const lastOverId = useRef<UniqueIdentifier | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [clonedItems, setClonedItems] = useState<ItemsProps | null>(null);
  const [boardName, setBoardName] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const onDragCancel = () => {
    if (clonedItems) {
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
    setClonedItems(items);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (active.id in items && over?.id) {
      const activeIndex = containersIds.indexOf(active.id);
      const overIndex = containersIds.indexOf(over.id);
      setContainersIds(arrayMove(containersIds, activeIndex, overIndex));
    }

    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    if (overId === TRASH_ID) {
      setItems({
        ...items,
        [activeContainer]: items[activeContainer].filter(
          (id) => id !== activeId
        ),
      });
      setActiveId(null);
      return;
    }

    if (overId === PLACEHOLDER_ID) {
      const newContainerId = nanoid();

      unstable_batchedUpdates(() => {
        setContainersIds([...containersIds, newContainerId]);
        setItems({
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (id) => id !== activeId
          ),
          [newContainerId]: [active.id],
        });
        setActiveId(null);
      });
      return;
    }

    const overContainer = findContainer(overId);

    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(overId);

      if (activeIndex !== overIndex) {
        setItems({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        });
      }
    }

    setActiveId(null);
  }

  function handleDragContainer({
    over,
    overId,
    active,
    overContainer,
    activeContainer,
  }: HandleDragItemProps) {
    const activeItems = items[activeContainer];
    const overItems = items[overContainer];
    const overIndex = overItems.indexOf(overId);
    const activeIndex = activeItems.indexOf(active.id);

    const position =
      over &&
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height
        ? 1
        : 0;
    let newIndex =
      overId in items ? overItems.length + 1 : overIndex + position;
    recentlyMovedToNewContainer.current = true;

    return {
      ...items,
      [activeContainer]: items[activeContainer].filter(
        (item) => item !== active.id
      ),
      [overContainer]: [
        ...overItems.slice(0, newIndex),
        items[activeContainer][activeIndex],
        ...overItems.slice(newIndex),
      ],
    };
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    const overId = over?.id;

    if (!overId || overId === TRASH_ID || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (
      !overContainer ||
      !activeContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems(
      handleDragContainer({
        over,
        active,
        overId,
        overContainer,
        activeContainer,
      })
    );
  }

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (overId === TRASH_ID) {
          return intersections;
        }

        if (overId in items) {
          const containerItems = items[overId];

          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );

  function handleAddColumn() {
    if (containers.length >= 5) {
      toast({
        title: "Ação não permitida",
        description: "O máximo de colunas foi atingido!",
      });

      return;
    }

    const newContainerId = nanoid();

    unstable_batchedUpdates(() => {
      setContainersIds([...containersIds, newContainerId]);
      setItems({ ...items, [newContainerId]: [] });
      setContainers([
        ...containers,
        {
          color: "red",
          id: newContainerId,
          name: `Coluna ${containers.length + 1}`,
        },
      ]);
    });
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const handleGetBoard = useCallback(async () => {
    try {
      setLoading(true);

      const board = await getBoard(params.id as string);

      if (!board) {
        return;
      }

      setBoardName(board.name);
      fillBoard(board);
    } catch (error) {
      toast({
        title: "Quadro não encontrato",
        description: "O quadro que você tentou acessar não existe.",
      });

      console.log(error);

      router.push("/boards");
    } finally {
      setLoading(false);
    }
  }, [params.id, fillBoard, toast, router]);

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
      console.log(error);
    } finally {
      setSaveLoading(false);
    }
  }, [cards, containers, containersIds, id, items, user?.id]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });

    if (addedFirstColumn.current) {
      setLoading(false);
      return;
    }

    handleGetBoard();

    addedFirstColumn.current = true;
    setLoading(true);
  }, [
    items,
    setItems,
    containers,
    setContainers,
    handleGetBoard,
    setContainersIds,
  ]);

  return {
    id,
    items,
    sensors,
    loading,
    activeId,
    boardName,
    saveLoading,
    handleUpdate,
    onDragCancel,
    dropAnimation,
    handleDragEnd,
    handleDragOver,
    PLACEHOLDER_ID,
    containersIds,
    handleDragStart,
    handleAddColumn,
    collisionDetectionStrategy,
  };
};
