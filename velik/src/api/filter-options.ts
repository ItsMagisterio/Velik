import { useQuery } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface FilterOptions {
  brands: string[];
  specs: Record<string, string[]>;
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ["/api/products/filter-options"],
    queryFn: () => customFetch<FilterOptions>("/api/products/filter-options"),
    staleTime: 5 * 60 * 1000,
  });
}
