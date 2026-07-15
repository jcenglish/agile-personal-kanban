import client from "./client";

export interface BurndownDetail {
  date: string,
  ideal_remaining: number,
  actual_remaining: number | null,
}

export interface VelocityDetail {
  sprint_name: string,
  committed_points: number,
  completed_points: number,
}

export const takeSnapshot = (sprintId: string): Promise<void> =>
  client.post(`/sprints/${sprintId}/snapshot`).then(() => undefined);

export const getBurndown = (sprintId: string): Promise<BurndownDetail[]> =>
  client.get<BurndownDetail[]>(`/sprints/${sprintId}/burndown`).then((r) => r.data);

export const getVelocity = (boardId: string, lastN?: number): Promise<VelocityDetail[]> =>
  client.get<VelocityDetail[]>(`/boards/${boardId}/velocity?last_n=${lastN}`).then((r) => r.data);