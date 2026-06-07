import { useDroppable } from "@dnd-kit/core";
import type { Column, Story } from "../../types";
import styles from "./KanbanColumn.module.css";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import StoryCard from "./StoryCard";
import { useCreateStory } from "../../hooks/useStories";

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
export default function KanbanColumn({column, stories, boardId}: Props) {
  // TODO: USER IMPLEMENTS
  useDroppable({ id: column.id })
  const totalColumnPoints = stories.reduce((acc, story) => acc += (story.points ?? 0), 0)
  const sortedStories = stories.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  const storyIds = sortedStories.map(story => story.id)
  const createStory = useCreateStory(boardId)
  
  return (
    <div className={styles.column}>
      <h1>{column.name}</h1>
      <p>{`Stories: ${stories.length}`}</p>
      <p>{`Total story points: ${totalColumnPoints}`}</p>
      <div>
        {sortedStories.map(story => {
          return (
            <SortableContext strategy={verticalListSortingStrategy} items={storyIds}>
              <StoryCard story={story}/>
            </SortableContext>
          )
        })}
      </div>
      <div>
        Add story:
        <label>Title:
          <input type="text" onKeyDown={(event) => {
            event.preventDefault()
            if (event.code === "Enter" && event.currentTarget.value) {
              createStory.mutate({
                title: event.currentTarget.value,
              })
              event.currentTarget.value = ""
              // TODO: Update API to handle creation of stories within column?
            }
          }}
          />
        </label>
      </div>
    </div>
  );
}
