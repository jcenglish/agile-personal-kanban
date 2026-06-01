import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { Story, Template } from "../types";
import type { TemplateCreate, TemplateUpdate } from "../api/templates";

/**
 * useTemplates — list all templates for a board.
 * Query key: ['templates', boardId]
 */
export function useTemplates(_boardId: string): UseQueryResult<Template[]> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useCreateTemplate — create a new template.
 * On success, invalidate ['templates', boardId].
 */
export function useCreateTemplate(
  _boardId: string
): UseMutationResult<Template, Error, TemplateCreate> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useUpdateTemplate — update template fields.
 * On success, invalidate ['templates', boardId].
 */
export function useUpdateTemplate(
  _boardId: string
): UseMutationResult<Template, Error, { templateId: string } & TemplateUpdate> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useDeleteTemplate — delete a template.
 * On success, invalidate ['templates', boardId].
 */
export function useDeleteTemplate(
  _boardId: string
): UseMutationResult<void, Error, string> {
  throw new Error("USER IMPLEMENTS");
}

/**
 * useInstantiateTemplate — POST /templates/{id}/instantiate.
 *
 * Creates a Story in the backlog from the template's fields.
 * On success, invalidate ['backlog', boardId] so the new story appears
 * immediately without a manual refresh.
 */
export function useInstantiateTemplate(
  _boardId: string
): UseMutationResult<Story, Error, string> {
  throw new Error("USER IMPLEMENTS");
}
