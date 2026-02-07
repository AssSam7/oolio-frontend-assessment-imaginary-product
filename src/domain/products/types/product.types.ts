export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  isNew: boolean;
  image: string;
  imageAlt: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
}
