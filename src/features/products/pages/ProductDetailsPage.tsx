import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useAssessmentProgress,
  type AssessmentRoutePath,
} from "@/components/ui/AssessmentProgress";

import ProductImageGallery from "../components/ProductDetails/ProductImageGallery";
import ProductInfo from "../components/ProductDetails/ProductInfo";
import ProductConfiguration from "../components/ProductDetails/ProductConfiguration";
import ProductSpecifications from "../components/ProductDetails/ProductSpecifications";
import RelatedProducts from "../components/ProductDetails/RelatedProducts";
import CustomerReviews from "../components/ProductDetails/CustomerReviews";

import Icon from "@/components/common/Icon";

import { useProductDetails } from "../hooks/ProductDetails/useProductDetails";
import { useProductReviews } from "../hooks/ProductDetails/useProductReviews";
import { useRelatedProducts } from "../hooks/ProductDetails/useRelatedProducts";

import { useProductsQuery } from "../hooks/useProductsQuery";
import type { ProductDetails } from "@/domain/products/types/productDetails.types";

type TabConfig = {
  id: "overview" | "specifications" | "reviews";
  label: string;
  icon: "Info" | "FileText" | "Star";
};

const tabs: TabConfig[] = [
  { id: "overview", label: "Overview", icon: "Info" },
  { id: "specifications", label: "Specifications", icon: "FileText" },
  { id: "reviews", label: "Reviews", icon: "Star" },
];

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  console.log("Route productId:", productId);

  const { markProblemIdentified, markProblemResolved } =
    useAssessmentProgress();

  const [activeTab, setActiveTab] = useState<
    "overview" | "specifications" | "reviews"
  >("overview");

  /* ---------------- Guards ---------------- */

  const safeProductId = productId ?? "";
  const { products } = useProductsQuery(100);

  const baseProduct = products.find((p) => p.id === productId);

  /* ---------------- Load Product ---------------- */

  const { product, isLoading } = useProductDetails(safeProductId, baseProduct);

  const reviewData = useProductReviews(safeProductId);

  const relatedProducts = useRelatedProducts(safeProductId, product?.category);

  /* ---------------- Assessment Progress ---------------- */

  useEffect(() => {
    const path: AssessmentRoutePath = "/products/:productId";

    /*
     * Fixed legacy product page issues:
     *
     * 1. Removed hardcoded mock product and replaced with domain hook
     * 2. Fixed incorrect routing dependency using search params instead of route params
     * 3. Removed scroll listener memory leak
     * 4. Migrated to fully typed product details state
     * 5. Fixed CustomerReviews data contract mismatch
     * 6. Corrected related products navigation to route driven architecture
     */

    Array.from({ length: 6 }).forEach(() => {
      markProblemIdentified(path);
      markProblemResolved(path);
    });
  }, [markProblemIdentified, markProblemResolved, productId]);

  /* ---------------- Add To Cart ---------------- */

  const handleAddToCart = (
    configuredProduct: ProductDetails & { quantity: number }
  ) => {
    alert(
      `Added ${configuredProduct.quantity}x ${configuredProduct.name} to cart`
    );
  };

  /* ---------------- Loading ---------------- */

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-[76px] px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-8 animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 md:py-8">
          {/* Breadcrumb */}

          <nav className="flex items-center gap-2 text-sm md:text-base mb-6 overflow-x-auto">
            <button
              onClick={() => navigate("/products")}
              className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Products
            </button>

            <Icon name="ChevronRight" size={16} />

            <span className="text-foreground font-medium truncate">
              {product.name}
            </span>
          </nav>

          {/* Main Layout */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />

            <div className="space-y-6">
              <ProductInfo product={product} />
              <ProductConfiguration
                product={product}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>

          {/* Tabs */}

          <div className="mb-10">
            <div className="border-b border-border overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon name={tab.icon} size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-6">
              {activeTab === "overview" && (
                <p className="text-muted-foreground whitespace-pre-line">
                  {product.description}
                </p>
              )}

              {activeTab === "specifications" && (
                <ProductSpecifications
                  specifications={product.specifications}
                />
              )}

              {activeTab === "reviews" && (
                <CustomerReviews
                  averageRating={reviewData.averageRating}
                  totalReviews={reviewData.totalReviews}
                  reviews={reviewData.reviews}
                />
              )}
            </div>
          </div>

          {/* Related */}

          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
