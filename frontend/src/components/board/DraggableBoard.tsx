import type { Column, Story } from "../../types";
import styles from "./DraggableBoard.module.css";

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
export default function DraggableBoard(_props: Props) {
  // TODO: USER IMPLEMENTS
  return <div className={styles.board}>USER IMPLEMENTS: DraggableBoard</div>;
}
