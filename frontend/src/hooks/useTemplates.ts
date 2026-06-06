import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import type { Story, Template } from "../types";
import type { TemplateCreate, TemplateUpdate } from "../api/templates";
import * as templateApi from "../api/templates";
import { ApiError } from "../api/ApiError";
import toast from "react-hot-toast";

/**
 * useTemplates — list all templates for a board.
 * Query key: ['templates', boardId]
 */
export function useTemplates(boardId: string): UseQueryResult<Template[]> {
  return useQuery({
    queryKey: ["templates", boardId],
    queryFn: () => templateApi.getTemplates(boardId),
  });
}

/**
 * useCreateTemplate — create a new template.
 * On success, invalidate ['templates', boardId].
 */
export function useCreateTemplate(
  boardId: string
): UseMutationResult<Template, Error, TemplateCreate> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TemplateCreate) =>
      templateApi.createTemplate(boardId, payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['templates', boardId] })
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}

/**
 * useUpdateTemplate — update template fields.
 * On success, invalidate ['templates', boardId].
 */
export function useUpdateTemplate(
  boardId: string
): UseMutationResult<Template, Error, { templateId: string } & TemplateUpdate> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({templateId, ...payload}) =>
      templateApi.updateTemplate(templateId, payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['templates', boardId] })
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}

/**
 * useDeleteTemplate — delete a template.
 * On success, invalidate ['templates', boardId].
 */
export function useDeleteTemplate(
  boardId: string
): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (boardId) =>
      templateApi.deleteTemplate(boardId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['templates', boardId] })
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}

/**
 * useInstantiateTemplate — POST /templates/{id}/instantiate.
 *
 * Creates a Story in the backlog from the template's fields.
 * On success, invalidate ['backlog', boardId] so the new story appears
 * immediately without a manual refresh.
 */
export function useInstantiateTemplate(
  boardId: string
): UseMutationResult<Story, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (templateId) =>
      templateApi.instantiateTemplate(templateId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['backlog', boardId] })
    },
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}
