import { useState } from "react";
import type { Sprint } from "../../types";
import styles from "./SprintForm.module.css";

interface Props {
  initial?: Partial<Sprint>;
  onSubmit: (values: { name: string; goal?: string; start_date?: string; end_date?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function SprintForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [goal, setGoal] = useState(initial?.goal ?? "");
  const [startDate, setStartDate] = useState(initial?.start_date ?? "");
  const [endDate, setEndDate] = useState(initial?.end_date ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        goal: goal.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Sprint Name
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sprint 2"
          autoFocus
        />
      </label>

      <label className={styles.label}>
        Goal
        <textarea
          className={styles.textarea}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Optional sprint goal"
          rows={2}
        />
      </label>

      <div className={styles.dateRow}>
        <label className={styles.label}>
          Start Date
          <input
            type="date"
            className={styles.input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className={styles.label}>
          End Date
          <input
            type="date"
            className={styles.input}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={!name.trim() || loading}>
          {loading ? "Saving…" : "Save"}
        </button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
