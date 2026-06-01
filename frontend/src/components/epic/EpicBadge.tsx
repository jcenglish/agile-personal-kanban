import type { Epic } from "../../types";
import styles from "./EpicBadge.module.css";

interface Props {
  epic: Epic;
}

export default function EpicBadge({ epic }: Props) {
  return (
    <span className={styles.badge}>
      <span className={styles.dot} style={{ backgroundColor: epic.color }} />
      {epic.name}
    </span>
  );
}
