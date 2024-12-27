import { useParams } from "@solidjs/router";
import getPath from "~/api/getPath";
import { UserNode } from "~/api/types";
import Content from "~/components/Content";
import Markdown from "~/components/Markdown";
import NodeDetails from "~/components/content/NodeDetails";
import TimeSince from "~/components/time/TimeSince";

export default function () {
  const params = useParams();

  const user = getPath<UserNode>(() => ({
    path: `/users/${params.slug}`,
  }));

  // TODO suspense does not work
  return (
    <Content
      flag={{
        icon: "icon-user",
        color: "bg-green",
      }}
      header={
        <>
          <h1 class="grow font-header text-3xl font-bold">
            {user.data?.name}
            <svg class="border-black mx-2 inline-block size-5 fill-gray-light align-baseline hover:bg-primary hover:fill-white">
              <use href="#icon-link" />
            </svg>
            <span class="text-2xl font-semibold text-gray-light">
              (@{user.data?.slug})
            </span>
          </h1>
          <NodeDetails>
            Joined <TimeSince dateTime={user.data?.published} />
          </NodeDetails>
        </>
      }
      author={user.data?.id}
    >
      <Markdown content={user.data?.body ?? ""} />
    </Content>
  );
}
