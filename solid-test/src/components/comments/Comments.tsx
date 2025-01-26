import { For, Suspense } from "solid-js";
import { NodeId, Node } from "~/api/getNode";
import NodeDetails from "../content/NodeDetails";
import AuthorInfo from "../content/AuthorInfo";
import Markdown from "../Markdown";
import Avatar from "../Avatar";
import getComments from "~/api/getComments";

export default function Comments(props: { node: NodeId<Node> }) {
  const node = getComments(() => props.node);

  return (
    <div>
      <h2 class="bg-gray text-TODO2 h-7 overflow-hidden pl-4 text-3xl font-bold uppercase italic">
        Comments
      </h2>
      <Suspense fallback="TODO">
        <For each={node.data}>
          {(comment) => (
            <article class="bg-TODO2 flex items-start odd:bg-white">
              <Avatar user={comment.author} small class="m-2 flex-none" />
              <div>
                <NodeDetails>
                  by <AuthorInfo author={comment.author} />, published TODO ago
                </NodeDetails>
                <Markdown content={comment.body} />
              </div>
            </article>
          )}
        </For>
      </Suspense>
    </div>
  );
}
