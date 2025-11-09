import { toStatic } from "~/lib/assets";
import getNode, { GameNode, NodeId } from "~/api/getNode";
import { Show, Suspense } from "solid-js";
import Link from "../base/Link";

export default function GameTile(props: {
  game: NodeId<GameNode>;
  showEvent?: boolean;
  viewTransitionName?: string;
}) {
  const game = getNode(() => ({
    id: props.game,
    include: {
      parent: props.showEvent,
    },
  }));
  const event = getNode(() => ({
    // TODO suspending id here leads to the whole component being suspended!
    id: game.isLoading ? -1 : game.data?.parent,
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
          : "bg-neutral-600";

  return (
    <Suspense fallback={<div class="aspect-5/4 bg-neutral-800" />}>
      <Link
        href={game.data?.path}
        class="group relative aspect-5/4 overflow-hidden bg-neutral-800"
        style={{
          "view-transition-name": props.viewTransitionName,
        }}
      >
        <img
          src={`${toStatic(game.data?.meta.cover ?? "///content/internal/tvfail.png")}.480x384.fit.jpg`}
          class="absolute object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div class="absolute flex w-full place-content-end items-stretch text-neutral-50">
          <Show when={props.showEvent}>
            <h2
              class="bg-opacity-85 grow overflow-hidden bg-neutral-800
                px-2 py-1 text-ellipsis whitespace-nowrap
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
          class="bg-opacity-85 absolute bottom-0 flex w-full bg-neutral-800 text-neutral-50
            transition-opacity duration-300 group-hover:opacity-0"
        >
          <h1 class="shrink overflow-hidden px-2 py-1 text-nowrap text-ellipsis">
            {game.data?.name}
          </h1>
        </div>
      </Link>
    </Suspense>
  );
}
