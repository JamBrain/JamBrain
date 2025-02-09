import { For } from "solid-js";
import {
  RouteDefinition,
  RoutePreloadFuncArgs,
  useParams,
} from "@solidjs/router";
import { createQuery, useQueryClient } from "@tanstack/solid-query";
import GameTile from "~/components/game/GameTile";
import getPath from "~/api/getPath";
import { UserNode } from "~/api/types";
import { useViewTransition } from "~/lib/viewTransition";

async function preload({ params }: RoutePreloadFuncArgs) {
  const queryClient = useQueryClient();

  const user = await getPath<UserNode>(() => ({
    path: `/users/${params.slug}`,
  })).promise;

  await queryClient.ensureQueryData({
    queryKey: ["user", "games", user.id],
    async queryFn() {
      return await (
        await fetch(
          `https://api.ldjam.com/vx/node/feed/${user.id}/authors/item/game?limit=24`,
        )
      ).json();
    },
  });
}

export const route = {
  preload,
} satisfies RouteDefinition;

export default function () {
  const [renderBlocker] = useViewTransition(preload);

  const params = useParams();

  const user = getPath<UserNode>(() => ({
    path: `/users/${params.slug}`,
    refetchOnMount: false,
  }));

  const gamesQuery = createQuery(() => ({
    queryKey: ["user", "games", user.data?.id],
    enabled: user.data?.id != null,
    async queryFn() {
      return await (
        await fetch(
          `https://api.ldjam.com/vx/node/feed/${user.data?.id}/authors/item/game?limit=24`,
        )
      ).json();
    },
  }));

  return (
    <div class="grid grid-cols-4 gap-2">
      {renderBlocker()}
      <For each={gamesQuery.data?.feed}>
        {(game) => (
          <GameTile
            game={game.id}
            showEvent
            viewTransitionName={`game-${game.id}`}
          />
        )}
      </For>
    </div>
  );
}
