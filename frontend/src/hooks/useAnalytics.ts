import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import * as analyticsApi from "../api/analytics";
import { ApiError } from "../api/ApiError";
import toast from "react-hot-toast";
import { BurndownPoint, VelocityPoint } from "../types";

export function useTakeSnapshot(
  sprintId: string
): UseMutationResult<void, Error> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      analyticsApi.takeSnapshot(sprintId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["analytics", "burndown", sprintId]}),
    onError: (err: ApiError) => {
      toast.error(err.message)
    }
  })
}

export function useBurndown(sprintId: string): UseQueryResult<BurndownPoint[]> {
  return useQuery({
    queryKey: ["analytics", "burndown", sprintId],
    queryFn: () => analyticsApi.getBurndown(sprintId),
  });
}

export function useVelocity(boardId: string, lastN?: number): UseQueryResult<VelocityPoint[]> {
  return useQuery({
    queryKey: ["analytics", "velocity", boardId, lastN],
    queryFn: () => analyticsApi.getVelocity(boardId, lastN),
  });
}

