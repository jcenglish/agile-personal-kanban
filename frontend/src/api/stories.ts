import type { EnergyType, Story } from "../types";
import client from "./client";

export interface StoryCreate {
  title: string;
  description?: string;
  points?: number;
  epic_id?: string;
  sprint_id?: string;
  is_urgent?: boolean;
  is_important?: boolean;
  energy_type?: EnergyType;
}

export interface StoryUpdate {
  title?: string;
  description?: string;
  points?: number | null;
  epic_id?: string | null;
  sprint_id?: string | null;
  column_id?: string | null;
  position?: number | null;
  is_urgent?: boolean | null;
  is_important?: boolean | null;
  energy_type?: EnergyType | null;
}

export interface StoryMoveRequest {
  column_id: string;
  before_id?: string;
  after_id?: string;
}

export const getStories = (boardId: string): Promise<Story[]> =>
  client.get<Story[]>(`/boards/${boardId}/stories`).then((r) => r.data);

export const getBacklog = (boardId: string): Promise<Story[]> =>
  client.get<Story[]>(`/boards/${boardId}/backlog`).then((r) => r.data);

export const getStory = (storyId: string): Promise<Story> =>
  client.get<Story>(`/stories/${storyId}`).then((r) => r.data);

export const createStory = (boardId: string, payload: StoryCreate): Promise<Story> =>
  client.post<Story>(`/boards/${boardId}/stories`, payload).then((r) => r.data);

export const updateStory = (storyId: string, payload: StoryUpdate): Promise<Story> =>
  client.put<Story>(`/stories/${storyId}`, payload).then((r) => r.data);

export const moveStory = (storyId: string, payload: StoryMoveRequest): Promise<Story> =>
  client.patch<Story>(`/stories/${storyId}/move`, payload).then((r) => r.data);

export const deleteStory = (storyId: string): Promise<void> =>
  client.delete(`/stories/${storyId}`).then(() => undefined);
