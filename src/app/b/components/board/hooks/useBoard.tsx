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
  pointerWithin,
  rectIntersection,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { useToast } from "@/components/ui/use-toast";
import { getBoard } from "@/services/boards";
import { getUser } from "@/services/users";
import { ItemsProps, useStoreAuth, useStoreBoard } from "@/store";
import { CardProps } from "@/types/board";
import { MouseSensor, TouchSensor } from "@/utils/custom-sensor";

import { useSocketClient } from "./useSocketClient";

export const TRASH_ID = "void";
const PLACEHOLDER_ID = "placeholder";

type HandleDragItemProps = {
  over: DragOverEvent["over"];
  overId: UniqueIdentifier;
  active: DragOverEvent["active"];
  overContainer: UniqueIdentifier;
  activeContainer: UniqueIdentifier;
};

type ControlStateBoard = {
  active: UniqueIdentifier | null;
  clone: ItemsProps | null;
  loading: boolean;
  saveLoading: boolean;
};

export const useBoard = () => {
  const { toast } = useToast();
  const { user, setUser } = useStoreAuth();
  const session = useSession();
  const { set, reset, items, cards, board, socket, containers, containersIds } =
    useStoreBoard();
  const searchParams = useSearchParams();
  const [hasAccess, setHasAccess] = useState(false);
  const { loading: loadingSocketClient, error: errorSocketClient } =
    useSocketClient({ set, board, hasAccess });
  const id = searchParams.get("id");
  const isCreator = user?.id === board.userId;

  const addedFirstColumn = useRef(false);
  const recentlyMovedToNewContainer = useRef(false);
  const lastOverId = useRef<UniqueIdentifier | null>(null);

  const [control, setControl] = useState<ControlStateBoard>({
    active: null,
    clone: null,
    loading: true,
    saveLoading: false,
  });

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      if (id in items) {
        return id;
      }

      return Object.keys(items).find((key) => items[key].includes(id));
    },
    [items]
  );

  const onDragCancel = useCallback(() => {
    if (control.clone) {
      set({ items: control.clone });
    }

    setControl((prev) => ({ ...prev, active: null, clone: null }));
  }, [control.clone, set]);

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      setControl((prev) => ({ ...prev, active: active.id, clone: items }));
    },
    [items]
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (active.id in items && over?.id) {
        const activeIndex = containersIds.indexOf(active.id);
        const overIndex = containersIds.indexOf(over.id);

        const update = {
          containersIds: arrayMove(containersIds, activeIndex, overIndex),
        };

        set(update);
        socket?.emit("update:board", JSON.stringify(update));
      }

      const activeContainer = findContainer(active.id);

      if (!activeContainer) {
        setControl((prev) => ({ ...prev, active: null }));
        return;
      }

      const overId = over?.id;

      if (overId == null) {
        setControl((prev) => ({ ...prev, active: null }));
        return;
      }

      if (overId === TRASH_ID) {
        const filterFromCurrentColumn = {
          [activeContainer]: items[activeContainer].filter(
            (id) => id !== control.active
          ),
        };

        const update = { items: { ...items, ...filterFromCurrentColumn } };

        set(update);
        socket?.emit("update:board", JSON.stringify(update));

        setControl((prev) => ({ ...prev, active: null }));
        return;
      }

      if (overId === PLACEHOLDER_ID) {
        const newContainerId = nanoid();

        unstable_batchedUpdates(() => {
          const moveToNewColumn = {
            [activeContainer]: items[activeContainer].filter(
              (id) => id !== control.active
            ),
            [newContainerId]: [active.id],
          };

          const update = {
            items: { ...items, ...moveToNewColumn },
            containersIds: [...containersIds, newContainerId],
          };

          set(update);
          socket?.emit("update:board", JSON.stringify(update));

          setControl((prev) => ({ ...prev, active: null }));
        });

        return;
      }

      const overContainer = findContainer(overId);

      if (overContainer) {
        const activeIndex = items[activeContainer].indexOf(active.id);
        const overIndex = items[overContainer].indexOf(overId);

        if (activeIndex !== overIndex) {
          const cardMoveToOtherColumn = {
            [overContainer]: arrayMove(
              items[overContainer],
              activeIndex,
              overIndex
            ),
          };

          const update = { items: { ...items, ...cardMoveToOtherColumn } };

          set(update);
          socket?.emit("update:board", JSON.stringify(update));
        }
      }

      setControl((prev) => ({ ...prev, active: null }));
    },
    [containersIds, control.active, findContainer, items, set, socket]
  );

  const handleDragContainer = useCallback(
    ({
      over,
      overId,
      active,
      overContainer,
      activeContainer,
    }: HandleDragItemProps) => {
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
    },
    [items]
  );

  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
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

      const card = cards.get(active.id);

      if (card) {
        card.columnId = overContainer;
        cards.set(active.id, card);
      }

      const update = {
        cards,
        items: handleDragContainer({
          over,
          active,
          overId,
          overContainer,
          activeContainer,
        }),
      };

      set(update);
      socket?.emit(
        "update:board",
        JSON.stringify({ ...update, cards: Array.from(update.cards) })
      );
    },
    [cards, findContainer, handleDragContainer, items, set, socket]
  );

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (control.active && control.active in items) {
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
        lastOverId.current = control.active;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [control.active, items]
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  const { isPending, data, isError } = useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoard(id as string),
    enabled: Boolean(id),
    retry: false,
  });

  const handleGetBoard = useCallback(async () => {
    setControl((prev) => ({ ...prev, loading: isPending }));

    if (isPending || !data) {
      return;
    }

    if (isError) {
      toast({
        title: "Quadro não encontrado",
        description: "Não foi possível acessar o quadro :(",
      });

      setHasAccess(false);
      return;
    }

    const update = {
      board: { id: data.id, name: data.name, userId: data.userId },
      containersIds: data.columns.map((column) => column.id),
      containers: data.columns.map((column) => ({
        id: column.id,
        name: column.name,
      })),
      items: data.columns.reduce(
        (acc, curr) =>
          Object.assign(acc, {
            [curr.id]: curr.cards.map((card) => card.id),
          }),
        {}
      ),
      cards: data.columns.reduce<Map<UniqueIdentifier, CardProps>>(
        (acc, curr) => {
          curr.cards.map((card) => acc.set(card.id, card));
          return acc;
        },
        new Map()
      ),
    };

    unstable_batchedUpdates(() => {
      reset();
      set(update);
      setHasAccess(true);
    });
  }, [data, isError, isPending, reset, set, toast]);

  const { isPending: isPendingUserData, data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
  });

  const authenticateUserOnBoard = useCallback(async () => {
    if (!board || isPendingUserData) {
      return;
    }

    if (session?.status === "authenticated" && session?.data?.user?.email) {
      if (userData) {
        sessionStorage.setItem("identifier", userData.id);
        setUser(userData.id);
      }

      return;
    }

    let identifier = sessionStorage.getItem("identifier");

    if (!identifier) {
      identifier = nanoid();
      sessionStorage.setItem("identifier", identifier);
    }

    setUser(identifier);
  }, [
    board,
    isPendingUserData,
    session?.data?.user?.email,
    session?.status,
    setUser,
    userData,
  ]);

  useEffect(() => {
    socket?.on("welcome", (welcomeId) => {
      if (welcomeId === socket.id || !board.name) {
        return;
      }

      socket.emit("connect:update_board", {
        welcomeId,
        board: { items, cards: Array.from(cards), containers, containersIds },
      });
    });
  }, [board.name, cards, containers, containersIds, items, socket]);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });

    if (addedFirstColumn.current) {
      setControl((prev) => ({ ...prev, loading: false }));
      return;
    }

    handleGetBoard();

    addedFirstColumn.current = true;
    setControl((prev) => ({ ...prev, loading: true }));
  }, [handleGetBoard]);

  useEffect(() => {
    authenticateUserOnBoard();
  }, [authenticateUserOnBoard]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return {
    id,
    board,
    items,
    cards,
    socket,
    sensors,
    control,
    isCreator,
    hasAccess,
    onDragCancel,
    dropAnimation,
    handleDragEnd,
    containersIds,
    handleGetBoard,
    handleDragOver,
    PLACEHOLDER_ID,
    handleDragStart,
    errorSocketClient,
    loadingSocketClient,
    collisionDetectionStrategy,
  };
};
