import { Accessor, createContext, createSignal, useContext } from "solid-js";
import getPath from "~/api/getPath";
import { Node } from "~/api/types";

// TOOD move to routes/[...path].tsx?
export const PageContext = createContext<
  [Accessor<{ path: string; id: number } | null>, any]
>(createSignal<{ path: string; id: number } | null>(null));

// TODO must this return a accessor?
export function useRootNodeId() {
  return useContext(PageContext)?.[0]()?.id;
}

export function useRootNode<T extends Node>(
  options: Accessor<
    Omit<ReturnType<Parameters<typeof getPath<T>>[0]>, "path" | "include">
  >,
) {
  // TODO should we use untrack?
  const path = useContext(PageContext)?.[0]()?.path;
  return getPath<T>(() => ({
    ...options(),
    path,
  }));
}
