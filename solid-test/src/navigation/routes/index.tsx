import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { Suspense, SuspenseList } from "solid-js";
import Content from "~/components/Content";
import Feed from "~/components/Feed";
import Nav from "~/components/Nav";
import Post from "~/components/post/PostCard";
import Banner from "~/components/Banner";
import Link from "~/components/base/Link";
import { GET } from "~/api/methods";
import EventDetails from "~/components/event/EventDetails";
import Markdown from "~/components/Markdown";

export default function Home() {
  const queryClient = useQueryClient();
  const featured = createQuery(() => ({
    queryKey: ["featured"],
    async queryFn() {
      const featured = (await GET("/vx/node2/what/1")).featured;
      queryClient.setQueryData(["node", featured.id], featured);
      queryClient.setQueryData(["path", featured.path], featured);
      return featured;
    },
  }));

  return (
    <>
      <Banner />
      {/* TODO move to suspenselist */}
      <Suspense fallback={<h1>Loading...</h1>}>
        <Content
          header={
            <h1 class="font-header text-3xl font-bold">
              <Link href={featured.data?.path}>{featured.data?.name}</Link>
            </h1>
          }
          flag={{
            text: "Event",
            icon: "icon-trophy",
            color: "bg-secondary",
          }}
        >
          <EventDetails event={featured.data?.id} />
          <Markdown content={featured.data?.body ?? ""} />
        </Content>
      </Suspense>
      <Nav>
        {[
          { href: "/", title: "Home", icon: "icon-home" },
          {
            href: `/feed`,
            label: "Feed",
            icon: "icon-feed",
            class: "border-2 border-white text-white",
          },
          {
            href: `/feed/news`,
            label: "News",
            icon: "icon-news",
            class: "border-2 border-white text-white",
          },
          {
            href: `/explore`,
            label: "Explore",
            icon: "icon-browse",
            class: "border-2 border-white text-white",
          },
          {
            href: `/games`,
            label: "Games",
            icon: "icon-gamepad",
            class: "border-2 border-white text-white",
          },
        ]}
      </Nav>
      <SuspenseList revealOrder="forwards" tail="collapsed">
        <Feed
          fetch={(offset, limit) =>
            fetch(
              `https://api.ldjam.com/vx/node/feed/1/all/post?offset=${offset}&limit=${limit}`,
            )
              .then((response) => response.json())
              .then((value) => value.feed)
          }
          key={["post", "all"]}
        >
          {(post) => (
            <Suspense fallback={<h1>Loading...</h1>}>
              <Post post={post.id} />
            </Suspense>
          )}
        </Feed>
      </SuspenseList>
    </>
  );
}
