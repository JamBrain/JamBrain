import Link from "../base/Link";
import getNode, { NodeId, UserNode } from "~/api/getNode";

export default function AuthorInfo(props: { author: NodeId<UserNode> }) {
  const author = getNode(() => ({
    id: props.author,
  }));

  return (
    <>
      <span class="font-bold">{author.data?.name}</span> (
      <Link
        rel="author"
        href={`/users/${author.data?.slug}`}
        class="text-primary"
      >
        @{author.data?.slug}
      </Link>
      )
    </>
  );
}
