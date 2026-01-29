import { fetchWrapper } from "@/lib/api";
import { Runbook, RunnableBlock } from "@/types/runbook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRunbooksQuery() {
  return useQuery<Runbook[]>({
    queryKey: ["runbooks"],
    queryFn: () => fetchWrapper("/runbooks"),
    refetchOnWindowFocus: false,
  });
}

export function useRunbookQueryById(runbookId: number | null) {
  const queryClient = useQueryClient();

  return useQuery<Runbook>({
    queryKey: ["runbooks", runbookId],
    queryFn: () => fetchWrapper(`/runbooks/${runbookId}`),
    initialData: () => {
      const runbooks = queryClient.getQueryData<Runbook[]>(["runbooks"]);
      return runbooks?.find((rb) => rb.id === runbookId);
    },
    enabled: !!runbookId,
    refetchOnWindowFocus: false,
  });
}

export function useRunnableBlockQuery(runbookId: number | null) {
  return useQuery<RunnableBlock[]>({
    queryKey: ["runnableBlocks", runbookId],
    queryFn: () => fetchWrapper(`/runbooks/${runbookId}/runnable-blocks`),
    enabled: !!runbookId,
    refetchOnWindowFocus: false,
  });
}
