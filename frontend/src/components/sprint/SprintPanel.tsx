import type { Sprint, Story } from "../../types";
import styles from "./SprintPanel.module.css";

interface Props {
  sprints: Sprint[];
  boardId: string;
  backlogStories: Story[];
}

/**
 * SprintPanel — left panel on BacklogPage for sprint planning.
 *
 * Implementation guide:
 *
 * 1. Sprint selector: a <select> dropdown listing all planning-status sprints
 *    by name. Selecting one sets local state for the active planning sprint.
 *
 * 2. Show stories in the selected sprint (filter from props or query by sprint_id).
 *    Each story row shows title, points, and a "Remove" button that calls
 *    useUpdateStory({ sprint_id: null }) to move it back to the backlog.
 *
 * 3. "Create Sprint" button — shows SprintForm in a modal or inline. On submit,
 *    call useCreateSprint and auto-select the new sprint.
 *
 * 4. Show the sprint's total story points at the top of the sprint's story list.
 *
 * 5. Start Sprint button — enabled only if the sprint has stories. Calls
 *    useStartSprint. The server will 409 if another sprint is already active;
 *    surface the error via toast.
 */
export default function SprintPanel(_props: Props) {
  // TODO: USER IMPLEMENTS
  return <div className={styles.panel}>USER IMPLEMENTS: SprintPanel</div>;
}
