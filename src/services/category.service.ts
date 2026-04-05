import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse, Category, SubCategory } from "@/types/api.types";

export const categoryService = {
  getAll() {
    return api.get<ApiResponse<Category[]>>(ENDPOINTS.CATEGORIES);
  },

  getCategoryById(categoryId: string): Category | undefined {
    // This will be used with client-side data
    return undefined;
  },

  getSubcategoriesByCategoryId(categories: Category[], categoryId: string): SubCategory[] {
    const category = categories.find((c) => c.id === categoryId);
    return category?.sub_categories ?? [];
  },

  getCategoryBySlug(categories: Category[], slug: string): Category | undefined {
    return categories.find((c) => c.type_cat_slug === slug);
  },

  getSubcategoryBySlug(
    categories: Category[],
    categorySlug: string,
    subcategorySlug: string
  ): SubCategory | undefined {
    const category = categories.find((c) => c.type_cat_slug === categorySlug);
    return category?.sub_categories?.find((sc) => sc.sub_cat_slug === subcategorySlug);
  },
};
