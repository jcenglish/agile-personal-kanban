import type { Epic, Sprint } from "../../types";

interface Props {
  boardId: string;
  epics: Epic[];
  sprints: Sprint[];
}

/**
 * StoryModal — detail view and inline editor for a single story.
 *
 * Implementation guide:
 *
 * 1. Read uiStore.selectedStoryId and uiStore.isModalOpen. If not open or no
 *    ID, render nothing (return null).
 *
 * 2. Fetch story data from the React Query cache using the story's ID from
 *    useStories or useBacklog. Do not make a separate network request if the
 *    story is already cached.
 *
 * 3. Inline-editable title: clicking the title renders an <input>; on blur or
 *    Enter, call useUpdateStory({ title }) and switch back to display mode.
 *
 * 4. All other fields are form controls:
 *    - description: <textarea>, saves on blur
 *    - points: <PointsPicker>
 *    - energy_type: <EnergyTypePicker>
 *    - epic_id: <select> populated from props.epics
 *    - is_urgent / is_important: <input type="checkbox">
 *    Each field update calls useUpdateStory immediately (no Save button needed).
 *
 * 5. Show sprint name or "Backlog" in a read-only badge.
 *
 * 6. Delete button: show a confirmation dialog (window.confirm or inline).
 *    On confirm, call useDeleteStory, then uiStore.closeModal().
 *
 * 7. Close button (✕) and clicking the backdrop call uiStore.closeModal().
 *
 * Interview note: optimistic field updates — call mutation immediately on
 * change; React Query will roll back on error. Use useMutation's onError
 * to restore the previous value and show a toast.
 */
export default function StoryModal(_props: Props) {
  // TODO: USER IMPLEMENTS
  return null;
}
