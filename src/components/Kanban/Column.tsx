import { useDroppable } from "@dnd-kit/core";
import React, { ReactNode } from "react";

interface ColumnProps {
  id: string;
  name: string;
  children: ReactNode;
}

const Column: React.FC<ColumnProps> = ({ id, name, children }) => {
  // useDroppable hook to make the column droppable
  const { setNodeRef, isOver } = useDroppable({ id });
  const isEmpty = React.Children.count(children) === 0;
  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-100 rounded shadow min-h-[400px] p-2 ${
        isOver ? "border-blue-500 border-2" : ""
      }`}
    >
      <h2 className="p-2 font-bold mb-2">{name}</h2>
      {isEmpty ? (
        <div
          className="text-gray-500 text-center p-4 border-dashed border-2 border-gray-300 rounded"
          style={{ minHeight: "80px" }}
        >
          Drop here
        </div>
      ) : (
        <ul>{children}</ul>
      )}
    </div>
  );
};

export default Column;
