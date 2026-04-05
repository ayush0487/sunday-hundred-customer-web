import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, X, Search } from "lucide-react";
import Image from "next/image";
import type { Category, SubCategory } from "@/types/api.types";

interface CategorySelectorProps {
  categories: Category[];
  onCategorySelect: (category: Category, subcategory: SubCategory) => void;
  onClose?: () => void;
  variant?: "modal" | "inline";
}

export function CategorySelector({
  categories,
  onCategorySelect,
  onClose,
  variant = "modal",
}: CategorySelectorProps) {
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
    if (category.sub_categories && category.sub_categories.length > 0) {
      setSelectedCategory(category);
      setStep("subcategories");
      setSearchQuery("");
    } else {
      // If no subcategories, create a default one
      const defaultSub: SubCategory = {
        id: category.id,
        sub_cat: category.type_cat,
        sub_cat_slug: category.type_cat_slug,
        sub_cat_img_url: category.type_cat_img_url,
        sub_cat_is_active: category.type_cat_is_active,
      };
      onCategorySelect(category, defaultSub);
    }
  };

  const handleSubcategorySelect = (subcategory: SubCategory) => {
    if (selectedCategory) {
      onCategorySelect(selectedCategory, subcategory);
    }
  };

  const handleBack = () => {
    setStep("categories");
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const isInline = variant === "inline";

  if (isInline) {
    const gridItems = step === "categories" ? filteredCategories : filteredSubcategories;

    return (
      <div className="w-full rounded-2xl border border-border bg-card shadow-card p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {step === "categories" ? (
            <motion.div
              key="categories-grid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {gridItems.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">No categories found</div>
              ) : (
                <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className="group flex flex-col items-center text-center"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-border bg-secondary/40 p-2 transition-all group-hover:border-gold group-hover:bg-accent/40 group-hover:shadow-sm sm:h-24 sm:w-24">
                        {category.type_cat_img_url ? (
                          <Image
                            src={category.type_cat_img_url}
                            alt={category.type_cat}
                            fill
                            className="object-contain p-2"
                            sizes="96px"
                          />
                        ) : null}
                      </div>
                      <p className="mt-2 text-base font-medium leading-5 text-foreground line-clamp-2 transition-colors group-hover:text-gold">
                        {category.type_cat}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="subcategories-grid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <button
                onClick={handleBack}
                className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {selectedCategory?.type_cat || "Back to categories"}
              </button>

              {gridItems.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">No subcategories found</div>
              ) : (
                <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
                  {filteredSubcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategorySelect(subcategory)}
                      className="group flex flex-col items-center text-center"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-border bg-secondary/40 p-2 transition-all group-hover:border-gold group-hover:bg-accent/40 group-hover:shadow-sm sm:h-24 sm:w-24">
                        {subcategory.sub_cat_img_url ? (
                          <Image
                            src={subcategory.sub_cat_img_url}
                            alt={subcategory.sub_cat}
                            fill
                            className="object-contain p-2"
                            sizes="96px"
                          />
                        ) : null}
                      </div>
                      <p className="mt-2 text-base font-medium leading-5 text-foreground line-clamp-2 transition-colors group-hover:text-gold">
                        {subcategory.sub_cat}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full sm:max-w-lg bg-card text-card-foreground rounded-t-3xl sm:rounded-2xl shadow-elevated max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 sm:py-6 rounded-t-3xl sm:rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {step === "categories" ? "Select Category" : "Select Service"}
            </h2>
            {step === "subcategories" && selectedCategory && (
              <p className="text-sm text-muted-foreground mt-1">{selectedCategory.type_cat}</p>
            )}
          </div>
          {onClose ? (
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-full transition"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          ) : null}
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={
                step === "categories" ? "Search categories..." : "Search services..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:bg-background transition text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === "categories" ? (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No categories found</p>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ x: 4 }}
                      onClick={() => handleCategorySelect(category)}
                      className="w-full p-4 bg-card border border-border rounded-xl hover:border-gold hover:bg-secondary/60 transition group text-left flex items-center gap-4"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={category.type_cat_img_url}
                          alt={category.type_cat}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-gold transition truncate">
                          {category.type_cat}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.sub_categories?.length || 0} services
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition flex-shrink-0" />
                    </motion.button>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="subcategories"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <button
                  onClick={handleBack}
                  className="w-full p-4 mb-4 text-left text-gold hover:opacity-80 font-medium flex items-center gap-2 transition"
                >
                  ← Back to Categories
                </button>

                {filteredSubcategories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No services found</p>
                  </div>
                ) : (
                  filteredSubcategories.map((subcategory) => (
                    <motion.button
                      key={subcategory.id}
                      whileHover={{ x: 4 }}
                      onClick={() => handleSubcategorySelect(subcategory)}
                      className="w-full p-4 bg-card border border-border rounded-xl hover:border-gold hover:bg-secondary/60 transition group text-left flex items-center gap-4"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={subcategory.sub_cat_img_url}
                          alt={subcategory.sub_cat}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-gold transition truncate">
                          {subcategory.sub_cat}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Explore {subcategory.sub_cat}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition flex-shrink-0" />
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
