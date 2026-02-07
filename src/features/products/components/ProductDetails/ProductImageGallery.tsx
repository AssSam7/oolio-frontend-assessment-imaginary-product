import { useState } from "react";

import Image from "@/components/common/Image";
import Icon from "@/components/common/Icon";

import type { ProductImage } from "@/domain/products/types/productDetails.types";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery = ({
  images,
  productName,
}: ProductImageGalleryProps) => {
  /*
   * Improvements:
   * - Removed unused image load tracking state and console side effects
   * - Added defensive checks for empty or missing image arrays
   * - Stabilized navigation logic for next/previous image transitions
   * - Improved accessibility with safer alt fallbacks
   * - Simplified state updates and removed legacy auto-rotation placeholder logic
   */

  const [selectedImage, setSelectedImage] = useState(0);

  /* ---------- Safe Image Handling ---------- */
  const totalImages = images?.length ?? 0;

  const safeIndex = selectedImage >= totalImages ? 0 : selectedImage;

  const currentImage =
    images && totalImages > 0 ? images[safeIndex] : undefined;

  /* ---------- Navigation ---------- */
  const nextImage = () => {
    if (totalImages === 0) return;
    setSelectedImage((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    if (totalImages === 0) return;
    setSelectedImage((prev) => (prev - 1 + totalImages) % totalImages);
  };

  /* ---------- Empty State Guard ---------- */
  if (!currentImage) {
    return (
      <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative bg-muted rounded-lg overflow-hidden mb-4">
        <Image
          src={currentImage.url}
          alt={currentImage.alt ?? productName}
          className="w-full object-cover"
        />

        {/* Prev */}
        {totalImages > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Previous image"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
        )}

        {/* Next */}
        {totalImages > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Next image"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        )}

        {/* Counter */}
        {totalImages > 1 && (
          <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs md:text-sm font-mono">
            {selectedImage + 1} / {totalImages}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {totalImages > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              aria-label={`Select image ${index + 1}`}
              className={`
                relative aspect-square rounded-md overflow-hidden border-2 transition-all
                ${
                  selectedImage === index
                    ? "border-primary scale-95"
                    : "border-border hover:border-muted-foreground"
                }
              `}
            >
              <Image
                src={image.url}
                alt={image.alt ?? `${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
