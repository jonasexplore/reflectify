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
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { useToast } from "@/components/ui/use-toast";
import { getBoard } from "@/services/boards";
import { getUser } from "@/services/users";
import { ItemsProps, useStoreAuth, useStoreBoard } from "@/store";
import { CardProps } from "@/types/board";

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
  const { set, items, cards, board, socket, containers, containersIds } =
    useStoreBoard();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading: loadingSocketClient } = useSocketClient({ set, board });
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
    if (control.clone) {
      set({ items: control.clone });
    }

    setControl((prev) => ({ ...prev, active: null, clone: null }));
  };

  function handleDragStart({ active }: DragStartEvent) {
    setControl((prev) => ({ ...prev, active: active.id, clone: items }));
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
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

    const update = {
      items: handleDragContainer({
        over,
        active,
        overId,
        overContainer,
        activeContainer,
      }),
    };

    set(update);
    socket?.emit("update:board", JSON.stringify(update));
  }

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
      const update = {
        items: { ...items, [newContainerId]: [] },
        containersIds: [...containersIds, newContainerId],
        containers: [
          ...containers,
          {
            color: "red",
            id: newContainerId,
            name: `Coluna ${containers.length + 1}`,
          },
        ],
      };

      set(update);
      socket?.emit("update:board", JSON.stringify(update));
    });
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  const handleGetBoard = useCallback(async () => {
    try {
      setControl((prev) => ({ ...prev, loading: true }));

      const board = await getBoard(id as string);

      if (!board) {
        return;
      }

      const update = {
        board: { id: board.id, name: board.name, userId: board.userId },
        containersIds: board.columns.map((column) => column.id),
        containers: board.columns.map((column) => ({
          color: "red",
          id: column.id,
          name: column.name,
        })),
        items: board.columns.reduce(
          (acc, curr) =>
            Object.assign(acc, {
              [curr.id]: curr.cards.map((card) => card.id),
            }),
          {}
        ),
        cards: board.columns.reduce<CardProps[]>(
          (acc, curr) => acc.concat(curr.cards),
          []
        ),
      };

      set(update);
    } catch (error) {
      toast({
        title: "Quadro não encontrato",
        description: "O quadro que você tentou acessar não existe.",
      });

      router.push("/boards");
    } finally {
      setControl((prev) => ({ ...prev, loading: false }));
    }
  }, [id, set, toast, router]);

  const authenticateUserOnBoard = useCallback(async () => {
    if (session?.status === "authenticated" && session?.data?.user?.email) {
      const output = await getUser(session.data.user.email);

      if (output) {
        setUser(output.id);
      }

      return;
    }

    setUser(nanoid());
  }, [session?.data?.user?.email, session?.status, setUser]);

  useEffect(() => {
    return () => {
      set({
        items: {},
        cards: [],
        containers: [],
        containersIds: [],
      });
    };
  }, [set]);

  useEffect(() => {
    socket?.on("welcome", (welcomeId) => {
      if (welcomeId === socket.id || !board.name) {
        return;
      }

      socket.emit("connect:update_board", {
        welcomeId,
        board: { items, cards, containers, containersIds },
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

  return {
    id,
    board,
    items,
    sensors,
    control,
    isCreator,
    onDragCancel,
    dropAnimation,
    handleDragEnd,
    containersIds,
    handleGetBoard,
    handleDragOver,
    PLACEHOLDER_ID,
    handleDragStart,
    handleAddColumn,
    loadingSocketClient,
    collisionDetectionStrategy,
  };
};
