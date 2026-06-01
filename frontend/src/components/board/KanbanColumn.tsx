import type { Column, Story } from "../../types";
import styles from "./KanbanColumn.module.css";

interface Props {
  column: Column;
  stories: Story[];
  boardId: string;
}

/**
 * KanbanColumn — a droppable Kanban column.
 *
 * Implementation guide:
 *
 * 1. Make the column a droppable area using useDroppable({ id: column.id })
 *    from @dnd-kit/core so stories can be dropped into it.
 *
 * 2. Header: display column.name, a story count badge (stories.length),
 *    and the total story points for the column (sum of story.points, skip nulls).
 *
 * 3. Apply a distinct visual style when column.is_done_column is true —
 *    e.g. a muted/green header color via a conditional CSS Module class.
 *
 * 4. Story list: wrap stories in a <SortableContext> with strategy
 *    verticalListSortingStrategy. Render a <StoryCard> for each story.
 *    Sort stories by position ascending before rendering.
 *
 * 5. "Add story" section at the bottom:
 *    An inline text input that, on Enter or blur (if non-empty), calls
 *    useCreateStory with { title, column_id: column.id, sprint_id } and
 *    position=last+1. After creation, clear the input.
 */
export default function KanbanColumn(_props: Props) {
  // TODO: USER IMPLEMENTS
  return <div className={styles.column}>USER IMPLEMENTS: KanbanColumn</div>;
}
