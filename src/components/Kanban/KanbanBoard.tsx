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
import { useState } from "react";
import ApplicationDetail from "./ApplicationDetail";

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items, columns, loading, error } = useSelector(selectApplications);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // 1) Fetch applications on mount
  // useEffect(() => {
  //   dispatch(fetchApplications());
  // }, [dispatch]);

  // DnD Kit sensors
  // By setting an activationConstraint with distance = 3, the user must move
  // the pointer at least 3px before the drag event is fired. This prevents
  // accidental drags when the user only intends to click on a card (especially
  // important if there's also an onClick handler).
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

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

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleCardClose = () => {
    setSelectedCardId(null);
  };

  // 2) Render
  if (loading) return <div className="p-4">Loading applications...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-2 sm:px-4 lg:px-8 py-4">
          {STAGES.map((stage) => (
            <SortableContext
              key={stage}
              id={stage}
              items={columns[stage]}
              strategy={verticalListSortingStrategy}
            >
              <Column name={stage} id={stage} count={columns[stage].length}>
                {columns[stage].map((itemId) => {
                  const app = items[itemId];
                  return (
                    <SortableKanbanCard
                      key={app.id}
                      id={app.id}
                      company={app.company}
                      position={app.jobTitle}
                      stage={stage}
                      onClick={handleCardClick}
                    />
                  );
                })}
              </Column>
            </SortableContext>
          ))}
        </div>
      </DndContext>
      {selectedCardId && (
        <ApplicationDetail
          application={items[selectedCardId]}
          onClose={handleCardClose}
        />
      )}
    </>
  );
};

export default KanbanBoard;
