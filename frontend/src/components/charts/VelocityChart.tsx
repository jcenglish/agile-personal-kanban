import { Bar, BarChart, LabelList, LabelProps, Legend, Tooltip, XAxis, YAxis } from "recharts";
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

export default function VelocityChart({data}: Props) {
  // TODO: USER IMPLEMENTS
  const chartData = data.map(d => ({
    ...d,
    percentage: d.committed_points === 0 ? 0 : Math.round((d.completed_points / d.committed_points) * 100),
  }));

  return <div className={styles.chart}>
    <BarChart data={chartData}>
      <Bar dataKey="committed_points" fill="#cbd5e1" />
      <Bar dataKey="completed_points" fill="#6366f1">
      <LabelList dataKey="percentage" position="top" formatter={(value: number) => `${value}%`}/>
      </Bar>
      <XAxis dataKey={"sprint_name"} />
      <YAxis label="Points" />
      <Tooltip />
      <Legend />
    </BarChart>
  </div>;
}
