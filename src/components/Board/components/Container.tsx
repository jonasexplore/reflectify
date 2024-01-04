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
import { ArrowsPointingInIcon, PlusIcon } from "@heroicons/react/24/outline";

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

type Props = {
  title: UniqueIdentifier;
  id: UniqueIdentifier;
  container: UniqueIdentifier;
  items: UniqueIdentifier[];
};

export const Container = ({ title, id, container, items }: Props) => {
  const {
    setNodeRef,
    transition,
    transform,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
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
    <div
      ref={setNodeRef}
      key={id}
      className={
        isDragging
          ? "w-full bg-slate-900 rounded p-2 h-full opacity-50"
          : "w-full bg-slate-900 rounded p-2 h-full"
      }
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
      <div className="flex items-center gap-2 justify-center cursor-pointer rounded-xl border border-dashed p-4 mx-2 border-slate-300">
        <PlusIcon className="w-4 h-4" />
        Adicionar
      </div>
    </div>
  );
};
