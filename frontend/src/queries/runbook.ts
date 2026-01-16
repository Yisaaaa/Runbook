import { fetchWrapper } from "@/lib/api";
import { Runbook } from "@/types/runbook";
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
  const router = useRouter();

  return useQuery<Runbook>({
    queryKey: ["runbook", runbookId],
    queryFn: () => fetchWrapper(`/runbooks/${runbookId}`),
    initialData: () => {
      const runbooks = queryClient.getQueryData<Runbook[]>(["runbooks"]);
      return runbooks?.find((rb) => rb.id === runbookId);
    },
    enabled: !!runbookId,
  });
}
