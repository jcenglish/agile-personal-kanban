import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { Sprint } from "../types";
import type { SprintCreate, SprintUpdate } from "../api/sprints";

/**
 * useSprints — list all sprints for a board.
 * Query key: ['sprints', boardId]
 */
export function useSprints(_boardId: string): UseQueryResult<Sprint[]> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useCreateSprint — create a new planning sprint.
 * On success, invalidate ['sprints', boardId].
 */
export function useCreateSprint(
  _boardId: string
): UseMutationResult<Sprint, Error, SprintCreate> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useUpdateSprint — update sprint name/goal/dates.
 * On success, invalidate ['sprints', boardId].
 */
export function useUpdateSprint(
  _boardId: string
): UseMutationResult<Sprint, Error, { sprintId: string } & SprintUpdate> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useStartSprint — POST /sprints/{id}/start.
 *
 * On success, invalidate ['sprints', boardId] AND ['stories', boardId]
 * because stories are now visible on the board with column assignments.
 * The server may 409 if another sprint is already active — surface via toast.
 */
export function useStartSprint(
  _boardId: string
): UseMutationResult<Sprint, Error, string> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useCompleteSprint — POST /sprints/{id}/complete.
 *
 * On success, invalidate ['sprints', boardId], ['stories', boardId],
 * and ['backlog', boardId] because unfinished stories move to the backlog.
 */
export function useCompleteSprint(
  _boardId: string
): UseMutationResult<Sprint, Error, string> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useDeleteSprint — DELETE /sprints/{id} (only planning sprints).
 * On success, invalidate ['sprints', boardId].
 */
export function useDeleteSprint(
  _boardId: string
): UseMutationResult<void, Error, string> {
  throw new Error("USER IMPLEMENTS");
}
