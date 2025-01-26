import Content from "../../components/Content";
import NodeDetails from "../../components/content/NodeDetails";
import Markdown from "../../components/Markdown";
import AuthorInfo from "../content/AuthorInfo";
import getNode, { GameNode, NodeId } from "~/api/getNode";

export default function GameCard(props: { game: NodeId<GameNode> }) {
  const node = getNode(() => ({
    id: props.game,
  }));

  return (
    <Content
      flag={{
        icon: "icon-gamepad",
        color: "bg-primary",
      }}
      header={
        <>
          <h1 class="font-header grow text-3xl font-bold">
            {node.data?.name}
            <svg class="fill-gray-light hover:bg-primary mx-2 inline-block size-5 border-black align-baseline hover:fill-white">
              <use href="#icon-link" />
            </svg>
          </h1>
          <NodeDetails>
            TODO by {/* TODO does this work in solid? */}
            {List(
              node.data?.meta.author?.map((author) => (
                <AuthorInfo key={author.id} author={author} />
              )),
            )}
          </NodeDetails>
        </>
      }
    >
      <Markdown content={node.data?.body ?? ""} />
    </Content>
  );
}

function List(elements: ReactNode[] | undefined) {
  return elements?.flatMap((e, i) =>
    i < elements.length - 2
      ? [e, ", "]
      : i < elements.length - 1
        ? [e, " and "]
        : [e],
  );
}
