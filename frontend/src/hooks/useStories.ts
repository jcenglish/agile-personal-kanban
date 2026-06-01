import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { Story } from "../types";
import type { StoryCreate, StoryMoveRequest, StoryUpdate } from "../api/stories";

/**
 * useStories — fetch all stories for a board (active sprint stories).
 * Query key: ['stories', boardId]
 */
export function useStories(_boardId: string): UseQueryResult<Story[]> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useBacklog — fetch stories where sprint_id IS NULL.
 * Query key: ['backlog', boardId]
 */
export function useBacklog(_boardId: string): UseQueryResult<Story[]> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useMoveStory — mutation with optimistic update.
 *
 * Pattern:
 *   onMutate: snapshot current ['stories', boardId] cache, apply the move
 *             locally (update column_id and reorder positions), return
 *             snapshot for rollback.
 *   onError:  restore snapshot via queryClient.setQueryData.
 *   onSettled: always invalidate ['stories', boardId] to sync with server.
 *
 * Why onSettled instead of onSuccess for invalidation: onSettled fires
 * even when the mutation errors, ensuring the cache never stays stale.
 */
export function useMoveStory(
  _boardId: string
): UseMutationResult<Story, Error, { storyId: string } & StoryMoveRequest> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useCreateStory — create a story in the backlog.
 * On success, invalidate ['stories', boardId] and ['backlog', boardId].
 */
export function useCreateStory(
  _boardId: string
): UseMutationResult<Story, Error, StoryCreate> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useUpdateStory — update story fields.
 * On success, invalidate ['stories', boardId] and ['backlog', boardId].
 */
export function useUpdateStory(
  _boardId: string
): UseMutationResult<Story, Error, { storyId: string } & StoryUpdate> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useDeleteStory — delete a story.
 * On success, invalidate ['stories', boardId] and ['backlog', boardId].
 */
export function useDeleteStory(
  _boardId: string
): UseMutationResult<void, Error, string> {
  throw new Error("USER IMPLEMENTS");
}
