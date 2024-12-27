import PostCard from "~/components/post/PostCard";
import Comments from "~/components/comments/Comments";
import { useRootNode } from "~/context/PageContext";
import getNode from "~/api/getNode";
import Nav from "~/components/Nav";
import { PostNode } from "~/api/types";

export default function Post() {
  const post = useRootNode<PostNode>(() => ({}));
  const game = getNode(() => ({
    id: post.data?.parent,
    refetchOnMount: false,
  }));
  const event = getNode(() => ({
    id: post.data?._superparent,
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
          },
          {
            href: `${event.data?.path}/games`,
            label: "Games",
            icon: "icon-gamepad",
            class: "border-2 border-white",
          },
          {
            href: game.data?.path,
            label: game.data?.name,
            icon: "icon-gamepad",
          },
        ]}
      </Nav>
      <PostCard post={post.data?.id!} />
      <Comments node={post.data?.id} />
    </>
  );
}
