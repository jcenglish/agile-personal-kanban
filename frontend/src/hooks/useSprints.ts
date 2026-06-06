import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { Sprint } from "../types";
import type { SprintCreate, SprintUpdate } from "../api/sprints";
import * as sprintApi from "../api/sprints";
import toast from "react-hot-toast";
import { ApiError } from "../api/ApiError";

/**
 * useSprints — list all sprints for a board.
 * Query key: ['sprints', boardId]
 */
export function useSprints(boardId: string): UseQueryResult<Sprint[]> {
  return useQuery({
    queryKey: ["sprints", boardId],
    queryFn: () => sprintApi.getSprints(boardId),
  });
}

/**
 * useCreateSprint — create a new planning sprint.
 * On success, invalidate ['sprints', boardId].
 */
export function useCreateSprint(
  boardId: string,
): UseMutationResult<Sprint, Error, SprintCreate> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SprintCreate) =>
      sprintApi.createSprint(boardId, payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ['sprints', boardId]})
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}

/**
 * useUpdateSprint — update sprint name/goal/dates.
 * On success, invalidate ['sprints', boardId].
 */
export function useUpdateSprint(
  boardId: string
): UseMutationResult<Sprint, Error, { sprintId: string } & SprintUpdate> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({sprintId, ...update}) =>
      sprintApi.updateSprint(sprintId, update),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['sprints', boardId] })
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}

/**
 * useStartSprint — POST /sprints/{id}/start.
 *
 * On success, invalidate ['sprints', boardId] AND ['stories', boardId]
 * because stories are now visible on the board with column assignments.
 * The server may 409 if another sprint is already active — surface via toast.
 */
export function useStartSprint(
  boardId: string
): UseMutationResult<Sprint, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sprintId: string) =>
      sprintApi.startSprint(sprintId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['sprints', boardId] })
      queryClient.invalidateQueries({ queryKey: ['stories', boardId] })
    },
    onError: (err: ApiError) => {
      if (err.status === 409) {
        toast.error("Another sprint is already active.")
      } else {
        toast.error(err.message)
      }
    }
  })
}

/**
 * useCompleteSprint — POST /sprints/{id}/complete.
 *
 * On success, invalidate ['sprints', boardId], ['stories', boardId],
 * and ['backlog', boardId] because unfinished stories move to the backlog.
 */
export function useCompleteSprint(
  boardId: string
): UseMutationResult<Sprint, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sprintId: string) =>
      sprintApi.completeSprint(sprintId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['sprints', boardId] })
      queryClient.invalidateQueries({ queryKey: ['stories', boardId] })
      queryClient.invalidateQueries({ queryKey: ['backlog', boardId] })
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}

/**
 * useDeleteSprint — DELETE /sprints/{id} (only planning sprints).
 * On success, invalidate ['sprints', boardId].
 */
export function useDeleteSprint(
  boardId: string
): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sprintId: string) =>
      sprintApi.deleteSprint(sprintId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['sprints', boardId] })
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}
