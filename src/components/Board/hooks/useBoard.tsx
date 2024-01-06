"use client";

import { useStoreBoard } from "@/app/store";
import { useToast } from "@/components/ui/use-toast";
import {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

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
  const { items, setItems, containers, setContainers } = useStoreBoard();

  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [clonedItems, setClonedItems] = useState<Record<
    string,
    UniqueIdentifier[]
  > | null>(null);
  const [containersNames, setContainersNames] = useState(
    Object.keys(items) as UniqueIdentifier[]
  );

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
      setContainersNames((containersNames) => {
        const activeIndex = containersNames.indexOf(active.id);
        const overIndex = containersNames.indexOf(over.id);

        return arrayMove(containersNames, activeIndex, overIndex);
      });
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
      const newContainerId = window.crypto.randomUUID();

      unstable_batchedUpdates(() => {
        setContainersNames((containersNames) => [
          ...containersNames,
          newContainerId,
        ]);
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

    const newContainerId = window.crypto.randomUUID();

    unstable_batchedUpdates(() => {
      setContainersNames((containersNames) => [
        ...containersNames,
        newContainerId,
      ]);
      setItems({ ...items, [newContainerId]: [] });
      setContainers([
        ...containers,
        {
          color: "red",
          id: newContainerId,
          name: "Coluna " + containers.length + 1,
        },
      ]);
    });
  }

  function handlerDelete(containerId: string) {
    setContainersNames((containers) =>
      containers.filter((id) => id !== containerId)
    );
    setContainers(containers.filter((item) => item.id !== containerId));
    delete items[containerId];
    setItems(items);
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return {
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
  };
};
