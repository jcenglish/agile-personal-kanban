import type { EnergyType } from "../../types";
import styles from "./EnergyTypePicker.module.css";

const OPTIONS: { value: EnergyType; label: string; emoji: string }[] = [
  { value: "physical", label: "Physical", emoji: "💪" },
  { value: "cognitive", label: "Cognitive", emoji: "🧠" },
  { value: "emotional", label: "Emotional", emoji: "❤️" },
];

interface Props {
  value: EnergyType | null;
  onChange: (value: EnergyType | null) => void;
}

export default function EnergyTypePicker({ value, onChange }: Props) {
  return (
    <div className={styles.picker}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.btn} ${value === opt.value ? styles.active : ""}`}
          onClick={() => onChange(value === opt.value ? null : opt.value)}
          title={opt.label}
        >
          <span className={styles.emoji}>{opt.emoji}</span>
          <span className={styles.label}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
