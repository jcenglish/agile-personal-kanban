import type { VelocityPoint } from "../../types";
import styles from "./VelocityChart.module.css";

interface Props {
  data: VelocityPoint[];
}

/**
 * VelocityChart — Recharts grouped bar chart of committed vs completed per sprint.
 *
 * Implementation guide:
 *
 * 1. Use <BarChart> with two <Bar> series:
 *    - "committed_points": color #cbd5e1 (gray)
 *    - "completed_points": color #6366f1 (indigo)
 *
 * 2. X-axis: data key "sprint_name".
 *    Y-axis: "Points".
 *
 * 3. Add a <LabelList> on the completed bar showing the completion percentage:
 *    Math.round((completed / committed) * 100) + "%" above each bar.
 *    Handle committed=0 to avoid division by zero.
 *
 * 4. Add <Tooltip> and <Legend>.
 *
 * 5. Handle empty data: show "No completed sprints yet."
 */
export default function VelocityChart(_props: Props) {
  // TODO: USER IMPLEMENTS
  return <div className={styles.chart}>USER IMPLEMENTS: VelocityChart</div>;
}
