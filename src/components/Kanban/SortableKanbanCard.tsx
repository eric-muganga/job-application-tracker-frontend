import { useSortable } from "@dnd-kit/sortable";

interface SortableKanbanCardProps {
  id: string;
  company: string;
  position: string;
  stage: string;
  onClick?: (id: string) => void;
}

const STAGE_COLORS: Record<string, string> = {
  Wishlist: "bg-purple-500",
  Applied: "bg-blue-500",
  Interviewing: "bg-yellow-500",
  Offer: "bg-green-500",
  Rejected: "bg-red-500",
};

const SortableKanbanCard: React.FC<SortableKanbanCardProps> = ({
  id,
  company,
  position,
  stage,
  onClick,
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
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : undefined,
    cursor: isDragging ? "grab" : "pointer",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(id)}
      className="m-2 p-2 bg-white shadow cursor-pointer rounded-md flex border"
    >
      <div
        className={`w-2 rounded-l ${STAGE_COLORS[stage]}`}
        style={{ minWidth: "8px" }}
      ></div>

      <div className="ml-2">
        <div className="font-semibold">{position}</div>
        <div className="text-sm text-gray-500">{company}</div>
      </div>
    </div>
  );
};

export default SortableKanbanCard;
