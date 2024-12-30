// import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import {
  // fetchApplications,
  moveItem,
  reorderColumn,
  selectApplications,
} from "../../../store/jobApplicationsSlice";
import { STAGES } from "../../../store/jobApplicationsSlice";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import Column from "./Column";
import SortableKanbanCard from "./SortableKanbanCard";

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items, columns, loading, error } = useSelector(selectApplications);

  // 1) Fetch applications on mount
  // useEffect(() => {
  //   dispatch(fetchApplications());
  // }, [dispatch]);

  // DnD Kit sensors
  const sensors = useSensors(useSensor(PointerSensor));

  // DragEndEvent handler to handle the end of a drag event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeColumn = findContainerForItem(active.id as string);
    const overColumn = over.id as string;

    if (!activeColumn || !overColumn) return;

    // If the active and over items are in the same column, reorder using arrayMove
    if (activeColumn === overColumn) {
      const currentItems = columns[activeColumn as keyof typeof columns];
      const oldIndex = currentItems.indexOf(active.id as string);
      const newIndex = currentItems.indexOf(over.id as string);

      if (oldIndex !== newIndex) {
        const reorderedItems = arrayMove(currentItems, oldIndex, newIndex);
        dispatch(
          reorderColumn({
            column: activeColumn as keyof typeof columns,
            reorderedItems,
          })
        );
      }
    } else {
      // If moved between columns, dispatch moveItem
      dispatch(
        moveItem({
          itemId: active.id as string,
          sourceColumn: activeColumn as keyof typeof columns,
          destColumn: overColumn as keyof typeof columns,
        })
      );
    }
  };

  // Helper: which column is this item ID in?
  const findContainerForItem = (itemId: string) => {
    return Object.keys(columns).find((key) =>
      columns[key as keyof typeof columns].includes(itemId)
    );
  };

  // 2) Render
  if (loading) return <div className="p-4">Loading applications...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-5 gap-4 p-4">
        {STAGES.map((stage) => (
          <SortableContext
            key={stage}
            id={stage}
            items={columns[stage]}
            strategy={verticalListSortingStrategy}
          >
            <Column name={stage} id={stage}>
              {columns[stage].map((itemId) => {
                const app = items[itemId];
                return (
                  <SortableKanbanCard
                    key={app.id}
                    id={app.id}
                    company={app.company}
                    position={app.jobTitle}
                  />
                );
              })}
            </Column>
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
