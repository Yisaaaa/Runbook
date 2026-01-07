import { fetchWrapper } from "@/lib/api";
import { Runbook } from "@/types/runbook";
import { useQuery } from "@tanstack/react-query";

export function useRunbook() {
  return useQuery<Runbook[]>({
    queryKey: ["runbooks"],
    queryFn: () => fetchWrapper("/runbooks"),
    refetchOnWindowFocus: false,
  });
}
