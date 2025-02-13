import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { Suspense, SuspenseList } from "solid-js";
import Content from "~/components/Content";
import Feed from "~/components/Feed";
import Nav, { NavItem } from "~/components/Nav";
import Post from "~/components/post/PostCard";
import Banner from "~/components/Banner";
import Link from "~/components/base/Link";
import { GET } from "~/api/methods";
import EventDetails from "~/components/event/EventDetails";
import Markdown from "~/components/Markdown";
import { RouteDefinition } from "@solidjs/router";
import { useViewTransition } from "~/lib/viewTransition";

async function preload() {
  const queryClient = useQueryClient();
  await queryClient.ensureQueryData({
    queryKey: ["featured"],
    async queryFn() {
      const featured = (await GET("/vx/node2/what/1")).featured;
      queryClient.setQueryData(["node", featured.id], featured);
      queryClient.setQueryData(["path", featured.path], featured);
      return featured;
    },
  });
}

export const route = {
  preload,
} satisfies RouteDefinition;

export default function Home() {
  const [renderBlocker] = useViewTransition(preload);

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
      {renderBlocker()}
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
          viewTransitionName="event"
        >
          <EventDetails event={featured.data?.id} />
          <Markdown content={featured.data?.body ?? ""} />
        </Content>
      </Suspense>
      <Nav viewTransitionName="main-nav">
        <NavItem href="/" end title="Home" icon="icon-home" />
        <NavItem href="/feed" end label="Feed" icon="icon-feed" />
        <NavItem href="/feed/news" end label="News" icon="icon-news" />
        <NavItem href="/explore" end label="Explore" icon="icon-browse" />
        <NavItem href="/games" end label="Games" icon="icon-gamepad" />
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
              <Post post={post.id} viewTransitionName={`post-${post.id}`} />
            </Suspense>
          )}
        </Feed>
      </SuspenseList>
    </>
  );
}
