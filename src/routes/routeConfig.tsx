import { lazy } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export interface AppRoute {
  path: string;
  element: ReactNode;
}

const DashboardPage = lazy(() => import("@/pages/dashboard"));

const AllProductPage = lazy(() => import("@/pages/products"));

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
  {
    path: "/products",
    element: <AllProductPage />,
  },
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
