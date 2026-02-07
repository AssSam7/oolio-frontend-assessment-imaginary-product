import { memo, useCallback, useMemo } from "react";
import Image from "@/components/common/Image";
import Icon from "@/components/common/Icon";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const MAX_RATING = 5;

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  /* ---------- Handlers ---------- */

  const handleClick = useCallback(() => {
    onClick(product);
  }, [onClick, product]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  /* ---------- Derived Data ---------- */

  const ratingStars = useMemo(() => {
    const fullStars = Math.floor(product.rating);

    return Array.from({ length: MAX_RATING }, (_, index) => (
      <Icon
        key={index}
        name={index < fullStars ? "Star" : "StarOff"}
        size={14}
        color={
          index < fullStars ? "var(--color-warning)" : "var(--color-muted)"
        }
      />
    ));
  }, [product.rating]);

  /* ---------- Render ---------- */

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all duration-250 hover:shadow-lg hover:scale-[0.98] w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.imageAlt}
          className="w-full h-full object-cover"
        />

        {product.isNew && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
            NEW
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {ratingStars}

          <span className="text-xs text-muted-foreground ml-1">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        {/* Price + Category */}
        <div className="flex items-center justify-between">
          <span className="text-lg md:text-xl font-bold text-primary whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>

          <span className="text-xs text-muted-foreground capitalize">
            {product.category}
          </span>
        </div>
      </div>
    </article>
  );
};

export default memo(ProductCard);
