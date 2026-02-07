export type AssessmentRoutePath =
  | "/dashboard"
  | "/products"
  | "/shopping-cart"
  | "/user-authentication";

export interface ProgressItem {
  identified: number;
  resolved: number;
  total: number;
}
