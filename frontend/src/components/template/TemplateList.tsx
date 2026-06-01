import type { Epic, Template } from "../../types";
import styles from "./TemplateList.module.css";

interface Props {
  templates: Template[];
  epics: Epic[];
  boardId: string;
}

/**
 * TemplateList — display all templates for the board with actions.
 *
 * Implementation guide:
 *
 * 1. Render a table or list of rows. Each row shows:
 *    - title
 *    - points (or "?" if null)
 *    - energy_type icon (💪/🧠/❤️ or blank)
 *    - epic name (use epics prop to look up by epic_id)
 *    - "Add to Backlog" button → calls useInstantiateTemplate(boardId)
 *    - "Delete" button → confirm, then useDeleteTemplate(boardId)
 *
 * 2. "New Template" button at the top → shows TemplateForm inline or in a
 *    modal. On submit, call useCreateTemplate(boardId).
 *
 * 3. Each row should also support inline edit: clicking the title (or an Edit
 *    button) opens TemplateForm pre-filled with the template's data. On submit,
 *    call useUpdateTemplate(boardId).
 *
 * 4. Empty state: "No templates yet. Create one to reuse recurring tasks."
 */
export default function TemplateList(_props: Props) {
  // TODO: USER IMPLEMENTS
  return <div className={styles.list}>USER IMPLEMENTS: TemplateList</div>;
}
