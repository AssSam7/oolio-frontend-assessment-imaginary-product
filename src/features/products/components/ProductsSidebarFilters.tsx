import { useMemo } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import Icon from "@/components/common/Icon";

export interface SidebarFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating?: number;
}

interface ProductsSidebarFiltersProps {
  filters: SidebarFilters;
  categories: string[];
  onChange: (filters: SidebarFilters) => void;
}

const ProductsSidebarFilters = ({
  filters,
  categories,
  onChange,
}: ProductsSidebarFiltersProps) => {
  const categoryOptions: SelectOption<string>[] = useMemo(
    () => [
      { value: "all", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ],
    [categories]
  );

  const ratingOptions: SelectOption<number>[] = [
    { value: 4, label: "4★ & above" },
    { value: 3, label: "3★ & above" },
    { value: 2, label: "2★ & above" },
  ];

  const update = (patch: Partial<SidebarFilters>) => {
    onChange({ ...filters, ...patch });
  };

  const resetFilters = () => {
    onChange({
      search: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      minRating: undefined,
    });
  };

  return (
    <aside className="h-fit bg-card border border-border rounded-lg p-4 md:p-5 space-y-5 md:sticky md:top-[90px]">
      <div className="flex items-center gap-2">
        <Icon name="Filter" size={18} />
        <h3 className="font-semibold text-foreground">Filters</h3>
      </div>

      <Input
        type="search"
        label="Search"
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
      />

      <Select
        label="Category"
        options={categoryOptions}
        value={filters.category}
        onChange={(v) => update({ category: v ?? "all" })}
      />

      <div className="flex gap-2">
        <Input
          type="number"
          label="Min Price"
          placeholder="$0"
          value={filters.minPrice}
          onChange={(e) => update({ minPrice: e.target.value })}
        />

        <Input
          type="number"
          label="Max Price"
          placeholder="$999"
          value={filters.maxPrice}
          onChange={(e) => update({ maxPrice: e.target.value })}
        />
      </div>

      <Select
        label="Rating"
        options={ratingOptions}
        value={filters.minRating}
        clearable
        onChange={(v) => update({ minRating: v })}
      />

      <Button
        variant="outline"
        iconName="RotateCcw"
        iconPosition="left"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </aside>
  );
};

export default ProductsSidebarFilters;
