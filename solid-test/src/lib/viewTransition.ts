import { useLocation, useParams } from "@solidjs/router";
import { RoutePreloadFuncArgs } from "@solidjs/router/dist/types";
import { createResource, ResourceReturn } from "solid-js";

export function startViewTransition(
  callbackOptions?: ViewTransitionUpdateCallback,
): void {
  if (!document.startViewTransition) {
    return callbackOptions?.();
  }
  document.startViewTransition(callbackOptions);
}

// TODO handle cancel
export function useViewTransition<T, R = unknown>(
  preload: (k: RoutePreloadFuncArgs) => T | Promise<T>,
): ResourceReturn<null, R> {
  const params = useParams();
  const location = useLocation();

  return createResource<null, RoutePreloadFuncArgs, R>(
    () => ({
      // WORKAROUND: spread params to make it reactive
      params: { ...params },
      location,
      // TODO initial renders should probably be handled differently
      intent: "navigate",
    }),
    async (args) => {
      await preload(args);

      return new Promise<null>((resolve) => {
        startViewTransition(() => {
          resolve(null);

          // time to render new view
          // TODO proper hook is missing, maybe add 20ms here
          return new Promise((r) => setTimeout(r, 0));
        });
      });
    },
  );
}
