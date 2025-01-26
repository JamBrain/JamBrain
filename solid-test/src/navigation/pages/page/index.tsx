import { PageNode } from "~/api/types";
import Content from "~/components/Content";
import NodeDetails from "~/components/content/NodeDetails";
import Markdown from "~/components/Markdown";
import TimeSince from "~/components/time/TimeSince";
import { useRootNode } from "~/context/PageContext";

export default function Page() {
  const node = useRootNode<PageNode>(() => ({}));

  return (
    <Content
      header={
        <>
          <h1 class="font-header grow text-3xl font-semibold">
            {node.data?.name}
          </h1>
          <NodeDetails>
            Last updated <TimeSince dateTime={node.data?.modified} />
          </NodeDetails>
        </>
      }
      flag={{
        icon: "icon-info",
        color: "bg-gray",
      }}
    >
      <Markdown content={node.data?.body} />
    </Content>
  );
}
