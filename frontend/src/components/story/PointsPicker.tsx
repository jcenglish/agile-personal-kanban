import styles from "./PointsPicker.module.css";

const FIBONACCI = [1, 2, 3, 5, 8, 13] as const;

interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function PointsPicker({ value, onChange }: Props) {
  return (
    <div className={styles.picker}>
      <button
        type="button"
        className={`${styles.btn} ${value === null ? styles.active : ""}`}
        onClick={() => onChange(null)}
      >
        ?
      </button>
      {FIBONACCI.map((n) => (
        <button
          key={n}
          type="button"
          className={`${styles.btn} ${value === n ? styles.active : ""}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
