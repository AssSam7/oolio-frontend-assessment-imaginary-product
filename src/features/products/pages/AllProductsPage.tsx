import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { PRODUCT_CATEGORIES } from "@/domain/products/constants/product.constants";

import { useProductsQuery } from "../hooks/useProductsQuery";
import { useProductsFilters } from "../hooks/useProductsFilters";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import {
  useProductsSorting,
  type ProductsSortOption,
} from "../hooks/useProductsSorting";

import ProductsHeader from "../components/ProductsHeader";
import ProductsSidebarFilters from "../components/ProductsSidebarFilters";
import ProductsGrid from "../components/ProductsGrid";
import ProductsEmptyState from "../components/ProductsEmptyState";

import type { Product } from "@/types";

const AllProductsPage = () => {
  const navigate = useNavigate();

  /* ---------- Product Count ---------- */

  const [productCount, setProductCount] = useState<number>(100);

  /* ---------- Filters ---------- */

  const { filters, updateFilters } = useProductsFilters();

  /* ---------- Sorting ---------- */

  const [sort, setSort] = useState<ProductsSortOption>("name");

  /* ---------- Fetch Products ---------- */

  const { products, isLoading } = useProductsQuery(productCount);

  /* ---------- Filtering ---------- */

  const filteredProducts = useFilteredProducts(products, filters);

  /* ---------- Sorting ---------- */

  const sortedProducts = useProductsSorting(filteredProducts, sort);

  /* ---------- Navigation ---------- */

  const handleProductClick = useCallback(
    (product: Product) => {
      navigate(`/product/${product.id}`);
    },
    [navigate]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <span className="text-muted-foreground">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 md:px-6 lg:px-8 pb-10">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <ProductsHeader
          total={sortedProducts.length}
          sort={sort}
          onSortChange={setSort}
          productCount={productCount}
          setProductCount={setProductCount}
        />

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr] gap-6">
          <ProductsSidebarFilters
            filters={{
              search: filters.search,
              category: filters.category,
              minPrice: filters.minPrice?.toString() ?? "",
              maxPrice: filters.maxPrice?.toString() ?? "",
              minRating: filters.minRating ?? undefined,
            }}
            categories={PRODUCT_CATEGORIES}
            onChange={(uiFilters) =>
              updateFilters({
                search: uiFilters.search,
                category: uiFilters.category,
                minPrice: uiFilters.minPrice
                  ? Number(uiFilters.minPrice)
                  : null,
                maxPrice: uiFilters.maxPrice
                  ? Number(uiFilters.maxPrice)
                  : null,
                minRating: uiFilters.minRating ?? null,
              })
            }
          />

          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            {sortedProducts.length > 0 ? (
              <ProductsGrid
                products={sortedProducts}
                onProductClick={handleProductClick}
              />
            ) : (
              <ProductsEmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
