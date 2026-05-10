import GameCard from "~/components/game/GameCard";
import Comments from "~/components/comments/Comments";
import { useRootNode } from "~/context/PageContext";
import getNode from "~/api/getNode";
import Nav, { NavItem } from "~/components/Nav";
import { GameNode } from "~/api/types";

export default function Game() {
  const node = useRootNode<GameNode>(() => ({}));
  const event = getNode(() => ({
    id: node.data?.parent,
    refetchOnMount: false,
  }));

  return (
    <>
      <Nav viewTransitionName="main-nav">
        <NavItem href="/" end title="Go Back" icon="icon-previous" />
        <NavItem
          href={event.data!.path}
          end
          label={event.data!.name}
          icon="icon-trophy"
          variant="outline"
        />
        <NavItem
          href={`${event.data!.path}/games`}
          end
          label="Games"
          icon="icon-gamepad"
          variant="outline"
        />
        <NavItem
          href={node.data!.path}
          label={node.data!.name}
          icon="icon-gamepad"
        />
      </Nav>
      <GameCard
        game={node.data?.id}
        viewTransitionName={`game-${node.data?.id}`}
      />
      <Comments node={node.data?.id} />
    </>
  );
}
