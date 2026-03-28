import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types/api.types";

export function useCategories(initialData?: Category[]) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll().then((res) => res.data.data),
    initialData,
  });
}
