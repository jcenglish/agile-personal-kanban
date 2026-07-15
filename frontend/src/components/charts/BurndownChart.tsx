import { Legend, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import type { BurndownPoint } from "../../types";
import styles from "./BurndownChart.module.css";

interface Props {
  data: BurndownPoint[];
  isActive: boolean;
}

/**
 * BurndownChart — Recharts line chart showing ideal vs actual burndown.
 *
 * Implementation guide:
 *
 * 1. Use <LineChart> from recharts with two <Line> series:
 *    - "ideal_remaining": dashed line (strokeDasharray="5 5"), color #94a3b8
 *    - "actual_remaining": solid line, color #6366f1
 *
 * 2. X-axis: data key "date" (ISO date string). Use a <XAxis> with
 *    tickFormatter to show a short date (e.g. "Jun 1").
 *
 * 3. Y-axis: label "Points". Start at 0.
 *
 * 4. If isActive (sprint is still running), add a <ReferenceLine> at x=today
 *    with a vertical dashed line and label "Today".
 *
 * 5. Add <Tooltip> and <Legend>.
 *
 * 6. Handle empty data: show "No snapshot data yet. Take a snapshot to see burndown."
 */
const tickFormatter = (value: string): string => {
  const date = new Date(value)
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short"
  }
  return `${date.toLocaleDateString(undefined, opts)}`
}

const today = new Date();

export default function BurndownChart({data, isActive}: Props) {
  // TODO: USER IMPLEMENTS
  if (data.length === 0) {
    return "No snapshot data. Take a snapshot to see burndown."
  }

  return <div className={styles.chart}>
    <LineChart data={data}>
      <XAxis dataKey="date" tickFormatter={tickFormatter}/>
      <YAxis label="Points" />
      <Line dataKey="ideal_remaining" strokeDasharray="5 5" color="#94a3b8" />

      <Line dataKey="actual_remaining" color="#6366f1" />
      {isActive && <ReferenceLine x={today.getTime()} label="Today" />}
      <Tooltip />
      <Legend/>
    </LineChart>
  </div>;
}
