import { SortableItem } from "@/app/item";
import { UniqueIdentifier } from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

type Props = {
  title: UniqueIdentifier;
  id: UniqueIdentifier;
  container: UniqueIdentifier;
  items: UniqueIdentifier[];
};

export const Container = ({ title, id, container, items }: Props) => {
  const { setNodeRef, transition, transform, attributes, listeners } =
    useSortable({
      id,
      data: {
        type: "container",
        children: items,
      },
      animateLayoutChanges,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      key={id}
      className="w-full bg-slate-800 rounded p-2 h-full"
      style={style}
    >
      <div className="flex justify-between">
        <span>{title}</span>
        <ArrowsPointingInIcon
          className="h-4 w-4"
          {...attributes}
          {...listeners}
        />
      </div>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
      </SortableContext>
    </li>
  );
};
