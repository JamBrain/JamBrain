import GameCard from "~/components/game/GameCard";
import Comments from "~/components/comments/Comments";
import { useRootNode } from "~/context/PageContext";
import getNode from "~/api/getNode";
import Nav from "~/components/Nav";
import { GameNode } from "~/api/types";

export default function Game() {
  const node = useRootNode<GameNode>(() => ({}));
  const event = getNode(() => ({
    id: node.data?.parent,
    refetchOnMount: false,
  }));

  return (
    <>
      <Nav>
        {[
          { href: "/", title: "Go Back", icon: "icon-previous" },
          {
            href: event.data?.path,
            label: event.data?.name,
            icon: "icon-trophy",
            class: "border-2 border-white",
          },
          {
            href: `${event.data?.path}/games`,
            label: "Games",
            icon: "icon-gamepad",
            class: "border-2 border-white",
          },
          {
            href: node.data?.path,
            label: node.data?.name,
            icon: "icon-gamepad",
          },
        ]}
      </Nav>
      <GameCard game={node.data?.id} />
      <Comments node={node.data?.id} />
    </>
  );
}
