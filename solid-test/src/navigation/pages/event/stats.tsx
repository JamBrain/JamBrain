import Content from "~/components/Content";
import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { useRootNode, useRootNodeId } from "~/context/PageContext";
import { GET } from "~/api/methods";
import { EventNode } from "~/api/types";
import { RouteDefinition } from "@solidjs/router";

export const route = {
  async preload() {
    const queryClient = useQueryClient();
    const nodeId = useRootNodeId();

    await queryClient.ensureQueryData({
      queryKey: ["stats", nodeId],
      async queryFn() {
        const json = await GET(`/vx/stats/${nodeId}`);
        return json.stats;
      },
    });
  },
} satisfies RouteDefinition;

export default function EventStats() {
  const node = useRootNode<EventNode>(() => ({
    refetchOnMount: false,
  }));

  const stats = createQuery(() => ({
    queryKey: ["stats", node.data?.id],
    enabled: node.data?.id != null,
    async queryFn() {
      const json = await GET(`/vx/stats/${node.data?.id}`);
      return json.stats;
    },
  }));

  return (
    <Content
      header={<h1 class="font-header grow text-3xl font-bold">Statistics</h1>}
    >
      <pre>{JSON.stringify(stats.data, null, 2)}</pre>
    </Content>
  );
}
