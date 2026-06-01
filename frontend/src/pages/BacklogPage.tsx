import { useParams } from "react-router-dom";
import styles from "./BacklogPage.module.css";

/**
 * BacklogPage — two-panel sprint planning view.
 *
 * Implementation guide:
 *
 * 1. Get boardId from useParams.
 *
 * 2. Call hooks at the top:
 *    - useBacklog(boardId) → backlog stories
 *    - useSprints(boardId) → planning sprints for the SprintPanel
 *    - useTemplates(boardId) → for the templates section
 *    - useEpics (direct query or hook) → for story creation epic selector
 *
 * 3. Left panel — SprintPanel:
 *    <SprintPanel sprints={sprints} boardId={boardId} backlogStories={backlogStories} />
 *
 * 4. Right panel — Backlog:
 *    - "Backlog" heading with count
 *    - Inline "Add story" form: title input + submit → useCreateStory
 *    - List of backlog stories. Each row: title, points badge, epic badge, and an
 *      "Add to Sprint" button that opens a sprint selector popover (or select dropdown)
 *      then calls useUpdateStory({ sprint_id }).
 *
 * 5. Templates section (below backlog or in a collapsible panel):
 *    <TemplateList templates={templates} epics={epics} boardId={boardId} />
 */
export default function BacklogPage() {
  const { boardId } = useParams<{ boardId: string }>();
  if (!boardId) return null;

  // TODO: USER IMPLEMENTS
  return (
    <div className={styles.page}>
      <p>USER IMPLEMENTS: BacklogPage</p>
    </div>
  );
}
