import type { Epic, Story } from "../../types";
import styles from "./StoryCard.module.css";

interface Props {
  story: Story;
  epic?: Epic;
}

/**
 * StoryCard — a draggable story card shown inside a KanbanColumn.
 *
 * Implementation guide:
 *
 * 1. Make draggable with useSortable({ id: story.id }) from @dnd-kit/sortable.
 *    Apply the transform and transition from useSortable to the card's style
 *    using CSS.Transform.toString() from @dnd-kit/utilities.
 *    Set isDragging style (opacity 0.4) when isDragging is true.
 *
 * 2. Display:
 *    - story.title (truncated if long)
 *    - Points badge: show story.points in a colored pill; gray/muted if null.
 *    - EpicBadge if epic is provided.
 *    - Energy type icon (💪 / 🧠 / ❤️) if story.energy_type is set.
 *    - Urgent indicator (🔴 or similar) if story.is_urgent.
 *    - Important indicator (⭐ or similar) if story.is_important.
 *
 * 3. On click (when not dragging): call uiStore.openModal(story.id) to open
 *    the StoryModal. Guard against triggering during drag.
 */
export default function StoryCard(_props: Props) {
  // TODO: USER IMPLEMENTS
  return <div className={styles.card}>USER IMPLEMENTS: StoryCard</div>;
}
