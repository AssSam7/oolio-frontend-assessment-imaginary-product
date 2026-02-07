import { forwardRef, useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/assets/images/no_image.png";

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt = "", fallbackSrc = DEFAULT_FALLBACK, ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);

    const handleError = () => {
      // Prevent infinite fallback loop
      if (imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      }
    };

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        loading={props.loading ?? "lazy"}
        onError={handleError}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export default Image;
