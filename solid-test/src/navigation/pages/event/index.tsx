import { EventNode } from "~/api/types";
import Content from "~/components/Content";
import Markdown from "~/components/Markdown";
import EventDetails from "~/components/event/EventDetails";
import { useRootNode } from "~/context/PageContext";

export default function Event() {
  const node = useRootNode<EventNode>(() => ({}));

  return (
    <Content
      header={
        <>
          <h1 class="font-header grow text-3xl font-bold">{node.data?.name}</h1>
        </>
      }
    >
      <EventDetails event={node.data?.id} />
      <Markdown content={node.data?.body ?? ""} />
    </Content>
  );
}
