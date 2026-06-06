import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import type { Board } from "../types";
import type { BoardUpdate } from "../api/boards";
import * as boardApi from "../api/boards";
import { ApiError } from "../api/ApiError";
import toast from "react-hot-toast";

/**
 * useBoard — fetch a board with its columns.
 *
 * Query key: ['board', boardId]
 * Uses stale-while-revalidate; refetches on window focus by default.
 * Returns the Board object including the `columns` array.
 */
export function useBoard(boardId: string): UseQueryResult<Board> {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardApi.getBoard(boardId),
  });
}

/**
 * useUpdateBoard — mutation to rename/update a board.
 *
 * On success, invalidate ['board', boardId] so the header re-renders
 * with the new name. Also invalidate ['boards'] so the boards list
 * reflects the rename.
 */
export function useUpdateBoard(
  boardId: string
): UseMutationResult<Board, Error, BoardUpdate> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BoardUpdate) =>
      boardApi.updateBoard(boardId, payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ['board', boardId]})
      queryClient.invalidateQueries({queryKey: ['boards']})
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}
