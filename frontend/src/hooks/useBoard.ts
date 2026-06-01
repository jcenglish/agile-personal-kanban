import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { Board } from "../types";
import type { BoardUpdate } from "../api/boards";

/**
 * useBoard — fetch a board with its columns.
 *
 * Query key: ['board', boardId]
 * Uses stale-while-revalidate; refetches on window focus by default.
 * Returns the Board object including the `columns` array.
 */
export function useBoard(_boardId: string): UseQueryResult<Board> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useUpdateBoard — mutation to rename/update a board.
 *
 * On success, invalidate ['board', boardId] so the header re-renders
 * with the new name. Also invalidate ['boards'] so the boards list
 * reflects the rename.
 */
export function useUpdateBoard(
  _boardId: string
): UseMutationResult<Board, Error, BoardUpdate> {
  throw new Error("USER IMPLEMENTS");
}
