import { useParams } from "react-router-dom";
import styles from "./BoardPage.module.css";
import { useBoard } from "../hooks/useBoard";
import { useStories } from "../hooks/useStories";
import { useCompleteSprint, useSprints } from "../hooks/useSprints";
import DraggableBoard from "../components/board/DraggableBoard";
import StoryModal from "../components/story/StoryModal";
import { Epic } from "../types";

/**
 * BoardPage — the main Kanban board view for an active sprint.
 *
 * Implementation guide:
 *
 * 1. Get boardId from useParams.
 *
 * 2. Call hooks at the top of the component:
 *    - useBoard(boardId) → board + columns
 *    - useStories(boardId) → stories in the active sprint
 *    - useSprints(boardId) → all sprints; derive activeSprint = sprints.find(s => s.status === 'active')
 *
 * 3. If no active sprint: show an empty state — "No active sprint. Go to Backlog to start one."
 *    with a link to /boards/:boardId/backlog.
 *
 * 4. Sprint header above the board:
 *    - Sprint name and goal
 *    - Date range (start_date – end_date)
 *    - Points: "X / Y pts" where X = completed (stories in done columns),
 *      Y = total in sprint
 *    - "Complete Sprint" button → useCompleteSprint(boardId)
 *
 * 5. Render <DraggableBoard columns={board.columns} stories={stories} boardId={boardId} />
 *
 * 6. Render <StoryModal boardId={boardId} epics={epics} sprints={sprints} />
 *    (always rendered; visibility is controlled by uiStore.isModalOpen inside the component)
 */
export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  if (!boardId) return null;
  const board = useBoard(boardId).data
  const stories = useStories(boardId).data ?? []
  const sprints = useSprints(boardId).data ?? []
  const epics: Epic[] = []
  const activeSprint = sprints.find(sprint => sprint.status === "active")
  const completeSprint = useCompleteSprint(boardId)
  const doneColumn = board?.columns.find(column => column.is_done_column)
  const completedSprintPoints = stories.reduce((acc, story) => {
    if (story.column_id === doneColumn?.id) {
      acc += story.points ?? 0
    }
    return acc
  }, 0)
  const totalSprintPoints = stories.reduce((acc, story) => acc += story.points ?? 0, 0)


  if (!activeSprint) {
    return <div>No active sprint. Go to Backlog to start one.</div>
  }
  // TODO: USER IMPLEMENTS
  return (
    <div className={styles.page}>
      <h1>{activeSprint.name}</h1>
      <p>{activeSprint.goal}</p>
      <p>{`${activeSprint.start_date} - ${activeSprint.end_date}`}</p>
      <p>{`Points: ${completedSprintPoints} / ${totalSprintPoints}`}</p>
      <button onClick={() => completeSprint.mutate(activeSprint.id)}>Complete sprint</button>
      <DraggableBoard columns={board?.columns ?? []} stories={stories} boardId={boardId} />
      <StoryModal boardId={boardId} epics={epics} sprints={sprints} />
    </div>
  );
}
