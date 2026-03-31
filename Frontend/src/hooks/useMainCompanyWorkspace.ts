import { useQuery } from "@tanstack/react-query";
import { getMainCompanyWorkspace } from "@/services/mainSupabaseWorkspace";

export const mainCompanyWorkspaceQueryKey = ["main-company-workspace"];

export function useMainCompanyWorkspace() {
  return useQuery({
    queryKey: mainCompanyWorkspaceQueryKey,
    queryFn: getMainCompanyWorkspace,
    retry: false,
  });
}
