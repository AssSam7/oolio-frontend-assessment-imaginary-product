import Icon from "@/components/common/Icon";

const ProductsEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon name="PackageX" size={48} color="var(--color-muted)" />

      <p className="text-muted-foreground mt-4">
        No products found matching your filters
      </p>
    </div>
  );
};

export default ProductsEmptyState;
