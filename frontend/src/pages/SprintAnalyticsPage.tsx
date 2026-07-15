import { useParams, useSearchParams } from "react-router-dom";
import styles from "./SprintAnalyticsPage.module.css";
import { useSprints } from "../hooks/useSprints";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as analyticsApi from "../api/analytics";
import { BurndownPoint, VelocityPoint } from "../types";
import BurndownChart from "../components/charts/BurndownChart";
import VelocityChart from "../components/charts/VelocityChart";

/**
 * SprintAnalyticsPage — charts for completed sprint analytics.
 *
 * Implementation guide:
 *
 * 1. Get boardId from useParams.
 *
 * 2. Call useSprints(boardId) and filter to completed sprints.
 *    Show a <select> dropdown to pick which completed sprint to view.
 *    Local state: selectedSprintId.
 *
 * 3. When a sprint is selected, fetch burndown and velocity data:
 *    - useQuery(['burndown', sprintId], () => getBurndown(sprintId))
 *    - useQuery(['velocity', boardId], () => getVelocity(boardId))
 *    These hit the analytics endpoints (user implements the backend logic).
 *
 * 4. Render:
 *    - <BurndownChart data={burndownData} isActive={false} />
 *    - <VelocityChart data={velocityData} />
 *
 * 5. Handle loading and empty states:
 *    - No completed sprints: "Complete a sprint to see analytics."
 *    - No snapshot data: show message from BurndownChart's empty state.
 *
 * Note: the analytics API endpoints are also user-implement stubs. Both
 * the frontend and backend sides need to be filled in for charts to render.
 */
export default function SprintAnalyticsPage() {
  const { boardId } = useParams<{ boardId: string }>();
  if (!boardId) return null;
  const sprints = useSprints(boardId).data ?? []
  const completedSprints = sprints.filter(sprint => sprint.end_date !== null)
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null)
  const [burndownData, setBurndownData] = useState<BurndownPoint[]>()
  const [velocityData, setVelocityData] = useState<VelocityPoint[]>()
  const [searchParams, _] = useSearchParams()

  useEffect(() => {
    if (selectedSprintId !== null) {
      const burndown = useQuery({
        queryKey: ["analytics", "burndown", selectedSprintId],
        queryFn: () => analyticsApi.getBurndown(selectedSprintId)
      })
      const velocity = useQuery({
        queryKey: ["analytics", "velocity", boardId],
        queryFn: () => analyticsApi.getVelocity(boardId, Number(searchParams.get("last_n")))
      })
      setBurndownData(burndown.data)
      setVelocityData(velocity.data)
    }
  }, [selectedSprintId])

  // TODO: USER IMPLEMENTS
  return (
    <div className={styles.page}>
      <select onChange={(event) => setSelectedSprintId(event.currentTarget.value)}>
        {completedSprints.map(sprint => (
          <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
        ))}
      </select>
      {burndownData && <BurndownChart data={burndownData} isActive={false} />}
      {velocityData && <VelocityChart data={velocityData} />}
    </div>
  );
}
