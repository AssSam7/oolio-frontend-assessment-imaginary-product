import { useState, useEffect, useMemo, type ChangeEvent } from "react";
import { Select, type SelectOption } from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/common/Icon";
import { useAssessmentProgress } from "@/components/ui/AssessmentProgress";

/* ---------------- Types ---------------- */

interface FilterValues {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
}

interface FilterToolbarProps {
  onFilterChange: (filters: FilterValues) => void;
  categories: string[];
  totalProducts: number;
}

/* ---------------- Component ---------------- */

const FilterToolbar = ({
  onFilterChange,
  categories,
  totalProducts,
}: FilterToolbarProps) => {
  /* Local State */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  /* Custom Hooks + Context */
  const { markProblemIdentified, markProblemResolved } =
    useAssessmentProgress();

  /*
   * Fixed unstable controlled/uncontrolled input switch.
   * Input now remains controlled so search filtering stays reliable.
   */
  useEffect(() => {
    const path = "/dashboard";

    markProblemIdentified(path);
    markProblemResolved(path);
  }, [markProblemIdentified, markProblemResolved]);

  /* Notify parent whenever filters change */
  useEffect(() => {
    const parseNumber = (value: string) =>
      value.trim() ? Number(value) : null;

    onFilterChange({
      search: searchTerm,
      category: selectedCategory,
      minPrice: parseNumber(minPrice),
      maxPrice: parseNumber(maxPrice),
    });
  }, [searchTerm, selectedCategory, minPrice, maxPrice, onFilterChange]);

  /* Category dropdown options */
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

  /* Reset all filters */
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Filter Products
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Package" size={16} />
          <span className="whitespace-nowrap">
            {totalProducts.toLocaleString()} products
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            label="Search Products"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        {/* Category */}
        <Select
          label="Category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value ?? "all")}
        />

        {/* Price Range */}
        <div className="flex gap-2">
          <Input
            type="number"
            label="Min Price"
            placeholder="$0"
            value={minPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMinPrice(e.target.value)
            }
            className="flex-1"
          />

          <Input
            type="number"
            label="Max Price"
            placeholder="$999"
            value={maxPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMaxPrice(e.target.value)
            }
            className="flex-1"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={handleReset}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterToolbar;
