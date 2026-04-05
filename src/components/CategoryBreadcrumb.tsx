import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Grid3x3, X } from "lucide-react";
import Image from "next/image";
import type { Category, SubCategory } from "@/types/api.types";

interface CategoryBreadcrumbProps {
  selectedCategory?: Category | null;
  selectedSubcategory?: SubCategory | null;
  onCategoryClick?: () => void;
  onClear?: () => void;
  isLoading?: boolean;
}

export function CategoryBreadcrumb({
  selectedCategory,
  selectedSubcategory,
  onCategoryClick,
  onClear,
  isLoading = false,
}: CategoryBreadcrumbProps) {
  if (!selectedCategory || !selectedSubcategory) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onCategoryClick}
        disabled={isLoading}
        className="w-full bg-card border-2 border-dashed border-border rounded-xl p-4 hover:border-gold transition flex items-center gap-3 text-left group disabled:opacity-50"
      >
        <div className="p-2 bg-accent rounded-lg group-hover:bg-secondary transition">
          <Grid3x3 className="w-5 h-5 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Select a Service</p>
          <p className="text-sm text-gray-500">Browse and select from categories</p>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gold transition group-hover:translate-y-0.5" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={selectedSubcategory.sub_cat_img_url}
              alt={selectedSubcategory.sub_cat}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-gray-500">{selectedCategory.type_cat}</p>
              <span className="text-gray-300">›</span>
              <p className="font-semibold text-gray-900 truncate">
                {selectedSubcategory.sub_cat}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-1">Selected service</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClear}
          className="p-2 hover:bg-red-50 rounded-lg transition flex-shrink-0"
          title="Clear selection"
        >
          <X className="w-5 h-5 text-red-500 hover:text-red-600" />
        </motion.button>
      </div>

      <button
        onClick={onCategoryClick}
        className="w-full px-4 py-2 bg-secondary hover:bg-accent transition text-foreground font-medium text-sm border-t border-border flex items-center justify-center gap-2"
      >
        <ChevronDown className="w-4 h-4" />
        Change Selection
      </button>
    </motion.div>
  );
}
