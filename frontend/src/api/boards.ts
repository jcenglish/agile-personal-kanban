import type { Board, Column } from "../types";
import client from "./client";

export interface BoardCreate {
  name: string;
  description?: string;
}

export interface BoardUpdate {
  name?: string;
  description?: string;
}

export interface ColumnCreate {
  name: string;
  position: number;
  is_done_column?: boolean;
}

export interface ColumnUpdate {
  name?: string;
  is_done_column?: boolean;
}

export interface ColumnReorderItem {
  id: string;
  position: number;
}

export const getBoards = (): Promise<Board[]> =>
  client.get<Board[]>("/boards").then((r) => r.data);

export const getBoard = (boardId: string): Promise<Board> =>
  client.get<Board>(`/boards/${boardId}`).then((r) => r.data);

export const createBoard = (payload: BoardCreate): Promise<Board> =>
  client.post<Board>("/boards", payload).then((r) => r.data);

export const updateBoard = (boardId: string, payload: BoardUpdate): Promise<Board> =>
  client.put<Board>(`/boards/${boardId}`, payload).then((r) => r.data);

export const deleteBoard = (boardId: string): Promise<void> =>
  client.delete(`/boards/${boardId}`).then(() => undefined);

export const getColumns = (boardId: string): Promise<Column[]> =>
  client.get<Column[]>(`/boards/${boardId}/columns`).then((r) => r.data);

export const createColumn = (boardId: string, payload: ColumnCreate): Promise<Column> =>
  client.post<Column>(`/boards/${boardId}/columns`, payload).then((r) => r.data);

export const updateColumn = (columnId: string, payload: ColumnUpdate): Promise<Column> =>
  client.put<Column>(`/columns/${columnId}`, payload).then((r) => r.data);

export const reorderColumns = (boardId: string, columns: ColumnReorderItem[]): Promise<Column[]> =>
  client.patch<Column[]>(`/boards/${boardId}/columns/reorder`, { columns }).then((r) => r.data);

export const deleteColumn = (columnId: string): Promise<void> =>
  client.delete(`/columns/${columnId}`).then(() => undefined);
