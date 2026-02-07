import type { Product } from "@/types";
import ProductCard from "@/features/dashboard/components/ProductCard";

interface ProductsGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductsGrid = ({ products, onProductClick }: ProductsGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-5">
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

export default ProductsGrid;
