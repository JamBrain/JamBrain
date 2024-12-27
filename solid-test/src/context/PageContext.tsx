import { Accessor, createContext, useContext } from "solid-js";
import getPath from "~/api/getPath";
import { Node } from "~/api/types";

export const PageContext = createContext<string>();

export function useRootNode<T extends Node>(
  options: Accessor<
    Omit<ReturnType<Parameters<typeof getPath<T>>[0]>, "path" | "include">
  >,
) {
  const path = useContext(PageContext);
  return getPath<T>(() => ({
    ...options(),
    path,
  }));
}
