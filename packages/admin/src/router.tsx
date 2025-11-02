import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { getToken } from "./lib/api";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RootLayout from "./pages/RootLayout";

// Root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Login route (public)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Dashboard route (protected)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
  beforeLoad: ({ location }) => {
    const token = getToken();
    if (!token) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

// Build route tree
const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute]);

// Create and export router
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
