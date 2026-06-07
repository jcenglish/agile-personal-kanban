import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import type { Story } from "../types";
import type { StoryCreate, StoryMoveRequest, StoryUpdate } from "../api/stories";
import * as storyApi from "../api/stories";
import toast from "react-hot-toast";
import { ApiError } from "../api/ApiError";

/**
 * useStories — fetch all stories for a board (active sprint stories).
 * Query key: ['stories', boardId]
 */
export function useStories(boardId: string): UseQueryResult<Story[]> {
  return useQuery({
    queryKey: ["stories", boardId],
    queryFn: () => storyApi.getStories(boardId)
  })
}

/**
 * useBacklog — fetch stories where sprint_id IS NULL.
 * Query key: ['backlog', boardId]
 */
export function useBacklog(boardId: string): UseQueryResult<Story[]> {
  return useQuery({
    queryKey: ['backlog', boardId],
    queryFn: () => storyApi.getBacklog(boardId)
  })
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
  boardId: string
): UseMutationResult<Story, Error, { storyId: string } & StoryMoveRequest> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ storyId, ...payload }) => storyApi.moveStory(storyId, payload),
    onMutate: async ({ storyId, ...payload }) => {
      await queryClient.cancelQueries({ queryKey: ["stories", boardId] })

      const previousStories = queryClient.getQueryData<Story[]>([
        "stories",
        boardId,
      ])

      if (previousStories) {
        const optimisticStories = previousStories.map((story) =>
          story.id === storyId
            ? { ...story, column_id: payload.column_id }
            : story
        )

        queryClient.setQueryData(["stories", boardId], optimisticStories)
      }

      return { previousStories }
    },
    onSettled: async () => queryClient.invalidateQueries({ queryKey: ['stories', boardId] }),
    onError: (err: ApiError, _variables, context) => {
      if (context?.previousStories) {
        queryClient.setQueryData(
          ["stories", boardId],
          context.previousStories
        )
      }
      toast.error(err.message)
    },
  })
}

/**
 * useCreateStory — create a story in the backlog.
 * On success, invalidate ['stories', boardId] and ['backlog', boardId].
 */
export function useCreateStory(
  boardId: string
): UseMutationResult<Story, Error, StoryCreate> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: StoryCreate) => storyApi.createStory(boardId, payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ['stories', boardId]})
      queryClient.invalidateQueries({queryKey: ['backlog', boardId]})
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}

/**
 * useUpdateStory — update story fields.
 * On success, invalidate ['stories', boardId] and ['backlog', boardId].
 */
export function useUpdateStory(
  boardId: string
): UseMutationResult<Story, Error, { storyId: string } & StoryUpdate> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({storyId, ...payload}) => storyApi.updateStory(boardId, payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ['stories', boardId]})
      queryClient.invalidateQueries({queryKey: ['backlog', boardId]})
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}

/**
 * useDeleteStory — delete a story.
 * On success, invalidate ['stories', boardId] and ['backlog', boardId].
 */
export function useDeleteStory(
  boardId: string
): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (storyId) => storyApi.deleteStory(storyId),
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ['stories', boardId]})
      queryClient.invalidateQueries({queryKey: ['backlog', boardId]})
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}
