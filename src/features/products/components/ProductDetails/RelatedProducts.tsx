import { useNavigate } from "react-router-dom";

import Image from "@/components/common/Image";
import Icon from "@/components/common/Icon";

import type { ProductDetails } from "@/domain/products/types/productDetails.types";

interface RelatedProductsProps {
  products: ProductDetails[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  const navigate = useNavigate();

  if (!products.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
        Related Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => navigate(`/products/${product.id}`)}
            className="group bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-all duration-250 text-left"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <Image
                src={product.images?.[0]?.url}
                alt={product.images?.[0]?.alt}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-250"
              />
            </div>

            {/* Content */}
            <div className="p-3 md:p-4">
              <h3 className="text-sm md:text-base font-medium text-foreground mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={12}
                      color={
                        i < Math.floor(product.rating)
                          ? "var(--color-warning)"
                          : "var(--color-muted)"
                      }
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-warning"
                          : "fill-muted"
                      }
                    />
                  ))}
                </div>

                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg md:text-xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>

                <Icon
                  name="ArrowRight"
                  size={18}
                  color="var(--color-primary)"
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
