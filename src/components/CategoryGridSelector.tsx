import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import type { Category, SubCategory } from "@/types/api.types";

interface CategoryGridSelectorProps {
  categories: Category[];
  onCategorySelect: (category: Category, subcategory: SubCategory) => void;
}

export function CategoryGridSelector({
  categories,
  onCategorySelect,
}: CategoryGridSelectorProps) {
  const [step, setStep] = useState<"categories" | "subcategories">("categories");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.type_cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubcategories = selectedCategory?.sub_categories?.filter((sub) =>
    sub.sub_cat.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep("subcategories");
    setSearchQuery("");
  };

  const handleSubcategorySelect = (subcategory: SubCategory) => {
    if (selectedCategory) {
      onCategorySelect(selectedCategory, subcategory);
      setStep("categories");
      setSelectedCategory(null);
      setSearchQuery("");
    }
  };

  const handleBack = () => {
    setStep("categories");
    setSelectedCategory(null);
    setSearchQuery("");
  };

  return (
    <div className="w-full">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={
              step === "categories" ? "Search categories..." : "Search services..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div>
        {step === "categories" ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground mb-4">
              {filteredCategories.length} categories available
            </p>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No categories found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category, idx) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleCategorySelect(category)}
                    className="relative group overflow-hidden rounded-xl border border-border hover:border-blue-500 transition h-32"
                  >
                    {/* Background Image */}
                    <Image
                      src={category.type_cat_img_url}
                      alt={category.type_cat}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <h3 className="font-bold text-white text-center text-sm sm:text-base line-clamp-2">
                        {category.type_cat}
                      </h3>
                      <p className="text-xs text-white/80 mt-1">
                        {category.sub_categories?.length || 0} services
                      </p>
                      <ChevronRight className="w-5 h-5 text-white mt-2 group-hover:translate-x-1 transition" />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="subcategories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 mb-4 transition"
            >
              ← Back to {selectedCategory?.type_cat}
            </button>

            <p className="text-sm text-muted-foreground mb-4">
              {filteredSubcategories.length} services available
            </p>

            {filteredSubcategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No services found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubcategories.map((subcategory, idx) => (
                  <motion.button
                    key={subcategory.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleSubcategorySelect(subcategory)}
                    className="relative group overflow-hidden rounded-xl border border-border hover:border-blue-500 transition h-32"
                  >
                    {/* Background Image */}
                    <Image
                      src={subcategory.sub_cat_img_url}
                      alt={subcategory.sub_cat}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <h3 className="font-bold text-white text-center text-sm sm:text-base line-clamp-2">
                        {subcategory.sub_cat}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-white mt-2 group-hover:translate-x-1 transition" />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
