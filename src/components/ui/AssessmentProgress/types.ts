export type AssessmentRoutePath =
  | "/dashboard"
  | "/products"
  | "/products/:productId"
  | "/shopping-cart"
  | "/user-authentication";

export interface ProgressItem {
  identified: number;
  resolved: number;
  total: number;
}
