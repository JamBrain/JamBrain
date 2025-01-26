import { toStatic } from "~/lib/assets";
import getNode, { GameNode, NodeId } from "~/api/getNode";
import { Show, Suspense } from "solid-js";
import Link from "../base/Link";

export default function GameTile(props: {
  game: NodeId<GameNode>;
  showEvent?: boolean;
}) {
  const game = getNode(() => ({
    id: props.game,
    include: {
      parent: props.showEvent,
    },
  }));
  const event = getNode(() => ({
    id: game.data?.parent,
    enabled: !!props.showEvent,
    refetchOnMount: false,
  }));

  const typeBackground = () =>
    game.data?.subsubtype === "compo"
      ? "bg-secondary"
      : game.data?.subsubtype === "jam"
        ? "bg-primary"
        : game.data?.subsubtype === "extra"
          ? "bg-green"
          : "bg-TODO";

  return (
    <Suspense fallback={<div class="aspect-5/4 bg-gray" />}>
      <Link
        href={game.data?.path}
        class="group relative aspect-5/4 overflow-hidden bg-gray"
      >
        <img
          src={`${toStatic(game.data?.meta.cover ?? "///content/internal/tvfail.png")}.480x384.fit.jpg`}
          class="absolute object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
        <div class="absolute flex w-full place-content-end items-stretch text-white">
          <Show when={props.showEvent}>
            <h2
              class="grow overflow-hidden text-ellipsis whitespace-nowrap
                bg-gray bg-opacity-85 px-2 py-1
                transition-opacity duration-300 group-hover:opacity-0"
            >
              <Suspense>{event.data?.name}</Suspense>
            </h2>
          </Show>
          <aside
            class={`px-2 py-0.5 text-xl font-bold uppercase ${typeBackground()}`}
          >
            {game.data?.subsubtype}
          </aside>
        </div>
        <div
          class="absolute bottom-0 flex w-full bg-gray bg-opacity-85 text-white
            transition-opacity duration-300 group-hover:opacity-0"
        >
          <h1 class="shrink overflow-hidden text-ellipsis text-nowrap px-2 py-1">
            {game.data?.name}
          </h1>
        </div>
      </Link>
    </Suspense>
  );
}
