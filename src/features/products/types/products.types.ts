import type { ProductFilters as DomainProductFilters } from "@/domain/products";

export interface ProductsPageFilters extends DomainProductFilters {
  categories: string[]; // multi category filter
  minRating: number | null; // advanced UX
}
