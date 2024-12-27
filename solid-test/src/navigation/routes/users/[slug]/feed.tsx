import { useParams } from "@solidjs/router";
import { Suspense, SuspenseList } from "solid-js";
import getPath from "~/api/getPath";
import { UserNode } from "~/api/types";
import Feed from "~/components/Feed";
import Post from "~/components/post/PostCard";

export default function () {
  const params = useParams();

  const user = getPath<UserNode>(() => ({
    path: `/users/${params.slug}`,
    refetchOnMount: false,
  }));

  return (
    <div class="flex flex-col gap-2">
      <Suspense>
        <SuspenseList revealOrder="forwards" tail="collapsed">
          <Feed
            fetch={(offset, limit) =>
              fetch(
                `https://api.ldjam.com/vx/node/feed/${user.data?.id}/author/post?offset=${offset}&limit=${limit}`,
              )
                .then((response) => response.json())
                .then((value) => value.feed)
            }
            key={["post", "user", user.data?.id]}
          >
            {(post) => (
              <Suspense fallback={<h1>Loading...</h1>}>
                <Post post={post.id} />
              </Suspense>
            )}
          </Feed>
        </SuspenseList>
      </Suspense>
    </div>
  );
}
