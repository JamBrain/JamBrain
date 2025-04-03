import { createQuery, SolidQueryOptions } from "@tanstack/solid-query";
import { Accessor, splitProps } from "solid-js";
import { GET } from "./methods";
import { IncludeOptions, Node, NodeId } from "./types";
import { queryClient } from "~/lib/query";
import { promiseWithResolvers } from "./utils";

type Batch = {
  nodeIds: number[];
  includeAuthor: boolean;
  includeParent: boolean;
  includeSuperParent: boolean;
};

function createEmptyBatch(): Batch {
  return {
    nodeIds: [],
    includeAuthor: false,
    includeParent: false,
    includeSuperParent: false,
  };
}

let nextBatch = createEmptyBatch();
let nextBatchFetchIsScheduled = false;
const fetchingNodesCache = new Map<number, PromiseWithResolvers<Node>>();

async function fetchAndResolveNodes(url: string, batch: Batch) {
  try {
    const json = await GET(url);

    const missingNodeIds = new Set(batch.nodeIds);
    json.node.forEach((node: Node) => {
      queryClient.setQueryData(["node", node.id], node);
      queryClient.setQueryData(["path", node.path], node);
      missingNodeIds.delete(node.id);
    });
    missingNodeIds.forEach((id) => {
      fetchingNodesCache.get(id)!.reject(new Error("TODO 404"));
    });
  } catch (e) {
    batch.nodeIds.forEach((id) => {
      fetchingNodesCache.get(id)!.reject(e);
    });
  }
  batch.nodeIds.forEach((id) => {
    fetchingNodesCache.delete(id);
  });
}

function fetchBatch() {
  const batch = nextBatch;
  nextBatch = createEmptyBatch();
  nextBatchFetchIsScheduled = false;

  const queryParams = [
    batch.includeAuthor && "author",
    batch.includeParent && "parent",
    batch.includeSuperParent && "superparent",
  ].filter(Boolean);

  const queryParamsString =
    queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  fetchAndResolveNodes(
    `/vx/node2/get/${batch.nodeIds.join("+")}${queryParamsString}`,
    batch,
  );
}

function setFetchingNodesEntry(id: number) {
  if (fetchingNodesCache.has(id)) {
    return fetchingNodesCache.get(id)!;
  }
  const cacheEntry = promiseWithResolvers<Node>();
  fetchingNodesCache.set(id, cacheEntry);
  return cacheEntry;
}

async function fetchNode(id: number, include: IncludeOptions) {
  if (!fetchingNodesCache.has(id) || nextBatch.nodeIds.includes(id)) {
    nextBatch.includeAuthor ||= include?.author ?? false;
    nextBatch.includeParent ||= include?.parent ?? false;
    nextBatch.includeSuperParent ||= include?.superParent ?? false;
  }
  if (fetchingNodesCache.has(id)) {
    return fetchingNodesCache.get(id)!.promise;
  }
  // create cache entry to avoid fetches while resolving
  const entry = setFetchingNodesEntry(id);
  nextBatch.nodeIds.push(id);

  if (!nextBatchFetchIsScheduled) {
    nextBatchFetchIsScheduled = true;
    setTimeout(fetchBatch, 0);
  }

  return entry.promise;
}

export default function getNode<ID extends number, T extends IncludeOptions>(
  options: Accessor<
    {
      id: ID | undefined;
      include?: T;
    } & Omit<
      SolidQueryOptions<
        ID extends NodeId<infer U extends Node, never> ? U : Node,
        Error,
        ID extends NodeId<infer U extends Node, never> ? U : Node,
        readonly [string, ID | undefined]
      >,
      "queryKey" | "queryFn" | "initialData"
    >
  >,
) {
  // TODO does this work? No, using opts.id for queryKey leads to bugs!
  const [opts, rest] = splitProps(options(), ["id", "include"]);

  return createQuery(() => ({
    ...rest,
    queryKey: ["node", options().id] as const,
    // TODO does order matter for suspense here? And does this work if options().enabled is function?
    enabled: options().id != null && rest.enabled,
    async queryFn() {
      // TODO do we need to untrack include?
      return (await fetchNode(
        options().id!,
        options().include ?? {},
      )) as ID extends NodeId<infer U extends Node, never> ? U : Node;
      // return json.node.find(
      //   (n: Node) => n.id == options().id,
      // ) as ID extends NodeId<infer U> ? U : Node;
      /* as filterIf<(ID extends `user:${number}`
                ? UserNode
                : ID extends `post:${number}`
                ? PostNode
                : Node), "author" extends T[number] ? false : true, "author">*/
    },
  }));
}
