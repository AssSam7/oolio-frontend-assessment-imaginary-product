import { Select, type SelectOption } from "@/components/ui/Select";
import Icon from "@/components/common/Icon";
import type { ProductsSortOption } from "../hooks/useProductsSorting";
import Input from "@/components/ui/Input";

interface ProductsHeaderProps {
  total: number;
  sort: ProductsSortOption;
  onSortChange: (value: ProductsSortOption) => void;
  productCount: number;
  setProductCount: (value: number) => void;
}

const sortOptions: SelectOption<ProductsSortOption>[] = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const ProductsHeader = ({
  total,
  sort,
  onSortChange,
  productCount,
  setProductCount,
}: ProductsHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">
      {/* ---------- Left Section ---------- */}

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          All Products
        </h1>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <Icon name="Package" size={16} />
          <span>{total.toLocaleString()} products available</span>
        </div>
      </div>

      {/* ---------- Right Controls ---------- */}

      <div className="flex flex-wrap items-center gap-4 lg:justify-end">
        {/* Sort Select */}

        <div className="min-w-[320px]">
          <Select
            layout="horizontal"
            label="Sort By"
            labelWidth="65px"
            options={sortOptions}
            value={sort}
            onChange={(v) => onSortChange(v ?? "name")}
          />
        </div>

        {/* Product Count */}

        <div className="flex items-center gap-2">
          <label
            htmlFor="product-count"
            className="text-sm font-medium text-foreground whitespace-nowrap"
          >
            Products
          </label>

          <Input
            id="product-count"
            type="number"
            min={1}
            max={100000}
            value={productCount}
            onChange={(e) =>
              setProductCount(Math.max(1, Number(e.target.value) || 100))
            }
            className="h-10 w-24 px-3 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsHeader;
