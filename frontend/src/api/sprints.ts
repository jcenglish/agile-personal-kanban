import type { Sprint, SprintDetail } from "../types";
import client from "./client";

export interface SprintCreate {
  name: string;
  goal?: string;
  start_date?: string;
  end_date?: string;
}

export interface SprintUpdate {
  name?: string;
  goal?: string;
  start_date?: string | null;
  end_date?: string | null;
}

export const getSprints = (boardId: string): Promise<Sprint[]> =>
  client.get<Sprint[]>(`/boards/${boardId}/sprints`).then((r) => r.data);

export const getSprint = (sprintId: string): Promise<SprintDetail> =>
  client.get<SprintDetail>(`/sprints/${sprintId}`).then((r) => r.data);

export const createSprint = (boardId: string, payload: SprintCreate): Promise<Sprint> =>
  client.post<Sprint>(`/boards/${boardId}/sprints`, payload).then((r) => r.data);

export const updateSprint = (sprintId: string, payload: SprintUpdate): Promise<Sprint> =>
  client.put<Sprint>(`/sprints/${sprintId}`, payload).then((r) => r.data);

export const startSprint = (sprintId: string): Promise<Sprint> =>
  client.post<Sprint>(`/sprints/${sprintId}/start`).then((r) => r.data);

export const completeSprint = (sprintId: string): Promise<Sprint> =>
  client.post<Sprint>(`/sprints/${sprintId}/complete`).then((r) => r.data);

export const deleteSprint = (sprintId: string): Promise<void> =>
  client.delete(`/sprints/${sprintId}`).then(() => undefined);
