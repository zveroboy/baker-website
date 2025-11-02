import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { queryClient } from "../lib/query-client";
import { router } from "../router";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
