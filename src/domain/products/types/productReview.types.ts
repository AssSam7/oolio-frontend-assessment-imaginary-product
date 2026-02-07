export interface ProductReviewImage {
  url: string;
  alt: string;
}

export interface ProductReview {
  id: number;
  author: string;
  avatar: string;
  avatarAlt: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  content: string;
  helpful: number;
  images: ProductReviewImage[];
}

export interface ProductReviewsData {
  averageRating: number;
  totalReviews: number;
  reviews: ProductReview[];
}
