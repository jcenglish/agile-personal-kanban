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
export default function BurndownChart(_props: Props) {
  // TODO: USER IMPLEMENTS
  return <div className={styles.chart}>USER IMPLEMENTS: BurndownChart</div>;
}
