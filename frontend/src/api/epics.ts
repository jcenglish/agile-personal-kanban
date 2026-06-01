import type { Epic } from "../types";
import client from "./client";

export interface EpicCreate {
  name: string;
  color?: string;
  description?: string;
}

export interface EpicUpdate {
  name?: string;
  color?: string;
  description?: string;
}

export const getEpics = (boardId: string): Promise<Epic[]> =>
  client.get<Epic[]>(`/boards/${boardId}/epics`).then((r) => r.data);

export const createEpic = (boardId: string, payload: EpicCreate): Promise<Epic> =>
  client.post<Epic>(`/boards/${boardId}/epics`, payload).then((r) => r.data);

export const updateEpic = (epicId: string, payload: EpicUpdate): Promise<Epic> =>
  client.put<Epic>(`/epics/${epicId}`, payload).then((r) => r.data);

export const deleteEpic = (epicId: string): Promise<void> =>
  client.delete(`/epics/${epicId}`).then(() => undefined);
