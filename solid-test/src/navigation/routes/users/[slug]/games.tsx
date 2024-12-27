import { For } from "solid-js";
import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import GameTile from "~/components/game/GameTile";
import getPath from "~/api/getPath";
import { UserNode } from "~/api/types";

export default function () {
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
      <For each={gamesQuery.data?.feed}>
        {(game) => <GameTile game={game.id} showEvent />}
      </For>
    </div>
  );
}
