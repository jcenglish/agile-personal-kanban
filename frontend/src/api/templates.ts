import type { EnergyType, Story, Template } from "../types";
import client from "./client";

export interface TemplateCreate {
  title: string;
  points?: number;
  is_urgent?: boolean;
  is_important?: boolean;
  energy_type?: EnergyType;
  epic_id?: string;
}

export interface TemplateUpdate {
  title?: string;
  points?: number | null;
  is_urgent?: boolean | null;
  is_important?: boolean | null;
  energy_type?: EnergyType | null;
  epic_id?: string | null;
}

export const getTemplates = (boardId: string): Promise<Template[]> =>
  client.get<Template[]>(`/boards/${boardId}/templates`).then((r) => r.data);

export const createTemplate = (boardId: string, payload: TemplateCreate): Promise<Template> =>
  client.post<Template>(`/boards/${boardId}/templates`, payload).then((r) => r.data);

export const updateTemplate = (templateId: string, payload: TemplateUpdate): Promise<Template> =>
  client.put<Template>(`/templates/${templateId}`, payload).then((r) => r.data);

export const deleteTemplate = (templateId: string): Promise<void> =>
  client.delete(`/templates/${templateId}`).then(() => undefined);

export const instantiateTemplate = (templateId: string): Promise<Story> =>
  client.post<Story>(`/templates/${templateId}/instantiate`).then((r) => r.data);
