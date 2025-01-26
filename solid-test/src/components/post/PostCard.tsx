import Content from "../Content";
import Link from "../base/Link";
import NodeDetails from "../content/NodeDetails";
import AuthorInfo from "../content/AuthorInfo";
import Markdown from "../Markdown";
import getNode from "~/api/getNode";
import { NodeId, PostNode } from "~/api/types";

export default function PostCard(props: { post: NodeId<PostNode> }) {
  const node = getNode(() => ({
    id: props.post,
  }));

  return (
    <Content
      author={node.data?.author}
      header={
        <>
          <h1 class="font-header grow text-3xl font-semibold">
            <Link href={node.data?.path}>{node.data?.name}</Link>
          </h1>
          <NodeDetails>
            By <AuthorInfo author={node.data?.author} />
          </NodeDetails>
        </>
      }
    >
      <Markdown content={node.data?.body} />
    </Content>
  );
}
