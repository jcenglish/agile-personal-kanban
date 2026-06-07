import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import type { Column, Story } from "../../types";
import styles from "./DraggableBoard.module.css";
import { useUIStore } from "../../store/uiStore";
import { useMoveStory } from "../../hooks/useStories";
import KanbanColumn from "./KanbanColumn";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import StoryCard from "./StoryCard";
import { useMemo } from "react";

interface Props {
  columns: Column[];
  stories: Story[];
  boardId: string;
}

/**
 * DraggableBoard — full drag-and-drop Kanban board.
 *
 * Implementation guide:
 *
 * 1. Wrap with DndContext from @dnd-kit/core.
 *    - onDragStart: call uiStore.setDragActive(activeId)
 *    - onDragEnd: derive column_id, before_id, after_id from the drop target,
 *      then call useMoveStory mutation. Clear drag state.
 *    - onDragCancel: call uiStore.clearDrag()
 *
 * 2. Render columns in a horizontal flex row.
 *    Each column is a <KanbanColumn> wrapped in a SortableContext with
 *    the IDs of stories in that column, sorted by position.
 *
 * 3. Render a <DragOverlay> showing a clone of the active StoryCard
 *    while dragging (use uiStore.dragState.activeId to find the story).
 *    DragOverlay gives visual fidelity — the card stays under the cursor
 *    rather than snapping to the placeholder.
 *
 * 4. Derive before_id / after_id:
 *    After DragEndEvent fires, look at the over.id (the droppable column
 *    or the story below which it was dropped). Sort stories in the target
 *    column by position; find the index; the story above is before_id,
 *    the story below is after_id.
 *
 * 5. Handle dragging to an empty column:
 *    If the target column has no stories, send { column_id, before_id: undefined,
 *    after_id: undefined }. The server will assign position=1.0.
 */
export default function DraggableBoard({columns, stories, boardId}: Props) {
  // TODO: USER IMPLEMENTS
  const uiStore = useUIStore()
  const moveStory = useMoveStory(boardId)

  const storiesByColumn = useMemo(() => {
    return columns.reduce<Record<string, Story[]>>((acc, column) => {
      acc[column.id] = stories
        .filter((story) => story.column_id === column.id)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      return acc;
    }, {});
  }, [columns, stories]);

  const activeStory = stories.find(
    (story) => story.id === uiStore.dragState.activeId
  );

  function handleDragStart(event: DragStartEvent) {
    if (typeof event.active.id === "string") {
      uiStore.setDragActive(event.active.id);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const activeId = event.active.id;
    const overId = event.over?.id;

    uiStore.clearDrag();

    if (typeof activeId !== "string" || !overId || activeId === overId) {
      return;
    }

    const sourceStory = stories.find((story) => story.id === activeId);
    if (!sourceStory) return;

    const isColumnTarget = columns.some((column) => column.id === overId);

    const columnId = isColumnTarget
      ? overId
      : stories.find((story) => story.id === overId)?.column_id;

    if (!columnId) return;

    const targetStories = storiesByColumn[columnId] ?? [];

    const payload =
      isColumnTarget
        ? { storyId: activeId, column_id: columnId as string}
        : (() => {
            const overIndex = targetStories.findIndex(
              (story) => story.id === overId
            );
            if (overIndex === -1) return { storyId: activeId, column_id: columnId as string};

            return {
              storyId: activeId,
              column_id: columnId as string,
              before_id: targetStories[overIndex - 1]?.id,
              after_id: targetStories[overIndex]?.id,
            };
          })();

    moveStory.mutate(payload);
  }

  // TODO: Use updated context, not this
  return <div className={styles.board}>
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={uiStore.clearDrag}
    >
      <div>
        {columns.map(column => {
          const columnStories = storiesByColumn[column.id] ?? [];
          return (
            <SortableContext
              key={column.id}
              items={columnStories.map((story) => story.id)}
              strategy={verticalListSortingStrategy}
            >
            <KanbanColumn
              column={column}
              stories={columnStories}
              boardId={boardId}
            />
            </SortableContext>)
})
        }
      </div>
      <DragOverlay>
        {activeStory ? <StoryCard story={activeStory} /> : null}
        </DragOverlay>
    </DndContext>
  </div>;
}
