import { fetchWrapper } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useRunbook() {
  return useQuery({
    queryKey: ["runbooks"],
    queryFn: () => fetchWrapper("/runbooks"),
    refetchOnWindowFocus: false,
  });
}
