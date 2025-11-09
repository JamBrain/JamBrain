import { Show, Suspense } from "solid-js";
import getNode, { NodeId, UserNode } from "~/api/getNode";
import { toStatic } from "~/lib/assets";

export default function Avatar(props: {
  user: NodeId<UserNode>;
  class: string;
}) {
  const query = getNode(() => ({
    id: props.user,
  }));

  return (
    <Suspense fallback={<div class="m-2 size-16" />}>
      <Show when={query.data}>
        <a
          href={`/users/${query.data?.slug}`}
          class={`hover:bg-primary ${props.class}`}
        >
          <img
            src={`${toStatic(query.data?.meta.avatar ?? "///content/internal/user64.png")}.64x64.fit.png`}
            class="m-2 size-16"
          />
        </a>
      </Show>
    </Suspense>
  );
}
