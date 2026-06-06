import {  useQuery, type UseQueryResult } from "@tanstack/react-query";
import type {  Epic } from "../types";
import * as epicApi from "../api/epics";


export function useEpics(boardId: string): UseQueryResult<Epic[]> {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => epicApi.getEpics(boardId),
  });
}
