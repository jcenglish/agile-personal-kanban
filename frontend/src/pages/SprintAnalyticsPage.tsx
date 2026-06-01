import { useParams } from "react-router-dom";
import styles from "./SprintAnalyticsPage.module.css";

/**
 * SprintAnalyticsPage — charts for completed sprint analytics.
 *
 * Implementation guide:
 *
 * 1. Get boardId from useParams.
 *
 * 2. Call useSprints(boardId) and filter to completed sprints.
 *    Show a <select> dropdown to pick which completed sprint to view.
 *    Local state: selectedSprintId.
 *
 * 3. When a sprint is selected, fetch burndown and velocity data:
 *    - useQuery(['burndown', sprintId], () => getBurndown(sprintId))
 *    - useQuery(['velocity', boardId], () => getVelocity(boardId))
 *    These hit the analytics endpoints (user implements the backend logic).
 *
 * 4. Render:
 *    - <BurndownChart data={burndownData} isActive={false} />
 *    - <VelocityChart data={velocityData} />
 *
 * 5. Handle loading and empty states:
 *    - No completed sprints: "Complete a sprint to see analytics."
 *    - No snapshot data: show message from BurndownChart's empty state.
 *
 * Note: the analytics API endpoints are also user-implement stubs. Both
 * the frontend and backend sides need to be filled in for charts to render.
 */
export default function SprintAnalyticsPage() {
  const { boardId } = useParams<{ boardId: string }>();
  if (!boardId) return null;

  // TODO: USER IMPLEMENTS
  return (
    <div className={styles.page}>
      <p>USER IMPLEMENTS: SprintAnalyticsPage</p>
    </div>
  );
}
