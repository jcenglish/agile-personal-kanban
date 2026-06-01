import { useParams } from "react-router-dom";
import styles from "./BoardPage.module.css";

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

  // TODO: USER IMPLEMENTS
  return (
    <div className={styles.page}>
      <p>USER IMPLEMENTS: BoardPage</p>
    </div>
  );
}
