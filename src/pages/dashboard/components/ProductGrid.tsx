import { memo } from "react";
import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import Icon from "@/components/common/Icon";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductGrid = ({ products, onProductClick }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-16">
        <Icon name="PackageX" size={48} color="var(--color-muted)" />
        <p className="text-muted-foreground mt-4">
          No products found matching your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default memo(ProductGrid);
