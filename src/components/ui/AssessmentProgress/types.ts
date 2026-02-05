export type AssessmentRoutePath =
  | "/dashboard"
  | "/product-details"
  | "/shopping-cart"
  | "/user-authentication";

export interface ProgressItem {
  identified: number;
  resolved: number;
  total: number;
}
