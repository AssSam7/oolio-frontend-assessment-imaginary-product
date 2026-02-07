import { lazy } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export interface AppRoute {
  path: string;
  element: ReactNode;
}

const DashboardPage = lazy(() => import("@/pages/dashboard"));

const AllProductsPage = lazy(() => import("@/pages/products"));

const ProductDetailsPage = lazy(() => import("@/pages/product-details"));

const UserAuthenticationPage = lazy(
  () => import("@/pages/user-authentication")
);

const ShoppingCartPage = lazy(() => import("@/pages/shopping-cart"));

const EbookPage = lazy(() => import("@/pages/ebook"));

const LibraryPage = lazy(() => import("@/pages/library"));

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },

  /* ---------- Products Flow ---------- */

  {
    path: "/products",
    element: <AllProductsPage />,
  },
  {
    path: "/products/:productId",
    element: <ProductDetailsPage />,
  },

  /* ---------- Other Routes ---------- */

  {
    path: "/user-authentication",
    element: <UserAuthenticationPage />,
  },
  {
    path: "/shopping-cart",
    element: <ShoppingCartPage />,
  },
  {
    path: "/ebook",
    element: <EbookPage />,
  },
  {
    path: "/library",
    element: <LibraryPage />,
  },
];
