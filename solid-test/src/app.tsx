import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import MainLayout from "./layout/MainLayout";
import { queryClient } from "./lib/query";
import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";

export default function App() {
  return (
    <Router
      transformUrl={(url) => `/routes${url}`}
      root={(props) => (
        <QueryClientProvider client={queryClient}>
          {/* TODO this does not prevent solid-query-devtools to be bundled in prod! */}
          {import.meta.env.DEV && <SolidQueryDevtools initialIsOpen={false} />}
          <MainLayout>
            <Suspense>{props.children}</Suspense>
          </MainLayout>
        </QueryClientProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
