import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { EnergyType, Epic, Story } from "../../types";
import styles from "./StoryCard.module.css";
import { useUIStore } from "../../store/uiStore";

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
export default function StoryCard({story}: Props) {
  // TODO: USER IMPLEMENTS
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: story.id });
  const openModal = useUIStore((state) => state.openModal);
  
  const energyLegend:Record<EnergyType, string> = {
    "physical": "💪",
    "cognitive": "🧠",
    "emotional": "❤️",
  }

  const matrixLegend: Record<string, string> = {
    urgent: "🚨",
    important: "⭐"
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  
  return (
    <div
      style={style}
      className={styles.card}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragging) {
          openModal(story.id)
        }
      }}
    >
      <h3>{story.title}</h3>
      <p>{story.points}</p>
      <p>{story.energy_type ? energyLegend[story.energy_type] : null}</p>
      <p>{story.is_important ? matrixLegend.important : null}</p>
      <p>{story.is_urgent ? matrixLegend.urgent : null}</p>
    </div>);
}
