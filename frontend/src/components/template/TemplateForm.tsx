import { useState } from "react";
import type { Epic, Template } from "../../types";
import EnergyTypePicker from "../story/EnergyTypePicker";
import PointsPicker from "../story/PointsPicker";
import styles from "./TemplateForm.module.css";

interface Props {
  initial?: Partial<Template>;
  epics: Epic[];
  onSubmit: (values: Partial<Template> & { title: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function TemplateForm({ initial, epics, onSubmit, onCancel, loading }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [points, setPoints] = useState<number | null>(initial?.points ?? null);
  const [isUrgent, setIsUrgent] = useState<boolean>(initial?.is_urgent ?? false);
  const [isImportant, setIsImportant] = useState<boolean>(initial?.is_important ?? false);
  const [energyType, setEnergyType] = useState(initial?.energy_type ?? null);
  const [epicId, setEpicId] = useState<string>(initial?.epic_id ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        points,
        is_urgent: isUrgent || undefined,
        is_important: isImportant || undefined,
        energy_type: energyType ?? undefined,
        epic_id: epicId || undefined,
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Title
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Template title"
          autoFocus
        />
      </label>

      <div className={styles.label}>
        Points
        <PointsPicker value={points} onChange={setPoints} />
      </div>

      <div className={styles.label}>
        Energy Type
        <EnergyTypePicker value={energyType} onChange={setEnergyType} />
      </div>

      <div className={styles.checkRow}>
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
          Urgent
        </label>
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={isImportant} onChange={(e) => setIsImportant(e.target.checked)} />
          Important
        </label>
      </div>

      {epics.length > 0 && (
        <label className={styles.label}>
          Epic
          <select className={styles.select} value={epicId} onChange={(e) => setEpicId(e.target.value)}>
            <option value="">None</option>
            {epics.map((epic) => (
              <option key={epic.id} value={epic.id}>{epic.name}</option>
            ))}
          </select>
        </label>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={!title.trim() || loading}>
          {loading ? "Saving…" : "Save"}
        </button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
