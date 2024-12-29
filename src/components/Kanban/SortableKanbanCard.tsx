import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface SortableKanbanCardProps {
  id: string;
  company: string;
  position: string;
}

const SortableKanbanCard: React.FC<SortableKanbanCardProps> = ({
  id,
  company,
  position,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // convert the transform to a style so the item can be moved
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="m-2 p-2 bg-white shadow cursor-pointer rounded-md"
    >
      <div className="font-semibold">{position}</div>
      <div className="text-sm text-gray-500">{company}</div>
    </div>
  );
};

export default SortableKanbanCard;
