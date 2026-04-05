import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import type { Category, SubCategory } from "@/types/api.types";
import { useState, useCallback, useMemo } from "react";

export function useCategories(initialData?: Category[]) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll().then((res) => res.data.data),
    initialData,
  });

  const categories = data ?? [];

  // Get subcategories for selected category
  const subcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return categoryService.getSubcategoriesByCategoryId(categories, selectedCategoryId);
  }, [categories, selectedCategoryId]);

  // Get selected category object
  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categories.find((c) => c.id === selectedCategoryId) ?? null;
  }, [categories, selectedCategoryId]);

  // Get selected subcategory object
  const selectedSubcategory = useMemo(() => {
    if (!selectedSubcategoryId) return null;
    return subcategories.find((sc) => sc.id === selectedSubcategoryId) ?? null;
  }, [subcategories, selectedSubcategoryId]);

  const handleSelectCategory = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null); // Reset subcategory when category changes
  }, []);

  const handleSelectSubcategory = useCallback((subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
  }, []);

  return {
    categories,
    isLoading,
    selectedCategoryId,
    selectedCategory,
    subcategories,
    selectedSubcategoryId,
    selectedSubcategory,
    handleSelectCategory,
    handleSelectSubcategory,
    resetSelection,
  };
}
