import { createQuery, SolidQueryOptions } from "@tanstack/solid-query";
import { Accessor } from "solid-js";
import { GET } from "./methods";
import { IncludeOptions, Node } from "./types";
import { queryClient } from "~/lib/query";
import { promiseWithResolvers } from "./utils";

const pathIncludeOptions = new Map<string, IncludeOptions>();
const fetchingPathsCache = new Map<string, PromiseWithResolvers<Node>>();

async function fetchAndResolvePath(path: string) {
  const include = pathIncludeOptions.get(path)!;
  const queryParams = [
    "node",
    include.author && "author",
    include.parent && "parent",
    include.superParent && "superparent",
  ].filter(Boolean);

  try {
    const json = await GET(`/vx/node2/walk/1${path}?${queryParams.join("&")}`);

    json.node.forEach((node: Node) => {
      queryClient.setQueryData(["node", node.id], node);
      queryClient.setQueryData(["path", node.path], node);
    });

    const node = json.node.find((n: Node) => n.id == json.node_id) as Node;
    if (node == null) {
      throw new Error("TODO 404");
    }
    fetchingPathsCache.get(path)!.resolve(node);
  } catch (e) {
    fetchingPathsCache.get(path)!.reject(e);
  }
}

function setFetchingPathEntry(path: string) {
  if (fetchingPathsCache.has(path)) {
    return fetchingPathsCache.get(path)!;
  }
  const cacheEntry = promiseWithResolvers<Node>();
  fetchingPathsCache.set(path, cacheEntry);
  return cacheEntry;
}

export async function fetchPath(path: string, include: IncludeOptions) {
  if (fetchingPathsCache.has(path)) {
    // fetch might already be executed, but doesn't matter
    const includeOptions = pathIncludeOptions.get(path)!;
    includeOptions.author ||= include?.author ?? false;
    includeOptions.parent ||= include?.parent ?? false;
    includeOptions.superParent ||= include?.superParent ?? false;

    return fetchingPathsCache.get(path)!.promise;
  }
  // create cache entry to avoid fetches while resolving
  const entry = setFetchingPathEntry(path);

  // copy include because we mutate it
  pathIncludeOptions.set(path, { ...include });

  setTimeout(() => fetchAndResolvePath(path), 0);

  return entry.promise;
}

export default function getPath<T extends Node>(
  options: Accessor<
    {
      path: string | undefined;
      include?: IncludeOptions;
    } & Omit<
      SolidQueryOptions<T, Error, T, readonly [string, string | undefined]> & {
        initialData?: undefined;
      },
      "queryKey" | "queryFn" | "initialData"
    >
  >,
) {
  return createQuery(() => ({
    ...options(),
    queryKey: ["path", options().path] as const,
    enabled: options().path != null,
    async queryFn() {
      return (await fetchPath(options().path!, options().include ?? {})) as T;
    },
  }));
}
