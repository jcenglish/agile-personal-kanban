import { useState } from "react";
import type { Epic } from "../../types";
import styles from "./EpicForm.module.css";

const PRESET_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444",
];

interface Props {
  initial?: Partial<Epic>;
  onSubmit: (values: { name: string; color: string; description?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function EpicForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? "#6366f1");
  const [description, setDescription] = useState(initial?.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit({ name: name.trim(), color, description: description.trim() || undefined });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Name
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Epic name"
          autoFocus
        />
      </label>

      <div className={styles.label}>
        Color
        <div className={styles.colorRow}>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.colorSwatch} ${color === c ? styles.selected : ""}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
          <input
            type="color"
            className={styles.colorInput}
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>

      <label className={styles.label}>
        Description
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={2}
        />
      </label>

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
