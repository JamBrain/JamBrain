import { Suspense } from "solid-js";
import { EventNode } from "~/api/types";
import Link from "~/components/base/Link";
import Content from "~/components/Content";
import Nav from "~/components/Nav";
import { useRootNode } from "~/context/PageContext";

export default function EventLayout(props: { children: any }) {
  const node = useRootNode<EventNode>(() => ({
    refetchOnMount: false,
  }));

  return (
    <>
      <Content
        header={
          <h1 class="font-header text-3xl font-bold">
            <Link href={node.data?.path}>{node.data?.name}</Link>
          </h1>
        }
        flag={{
          text: "Event",
          icon: "icon-trophy",
          color: "bg-secondary",
        }}
        viewTransitionName="event"
      />
      <Nav viewTransitionName="main-nav">
        {[
          { href: "/", title: "Go Back", icon: "icon-previous" },
          {
            href: node.data?.path,
            label: node.data?.name,
            // icon: "icon-user",
            class: "border-2 border-white",
          },
          {
            href: `${node.data?.path}/results`,
            label: "Results",
            icon: "icon-gamepad",
          },
          {
            href: `${node.data?.path}/games`,
            label: "Games",
            icon: "icon-gamepad",
          },
          {
            href: `${node.data?.path}/theme`,
            label: "Theme",
            // icon: "icon-gamepad",
          },
          {
            href: `${node.data?.path}/stats`,
            label: "Stats",
            // icon: "icon-gamepad",
          },
        ]}
      </Nav>
      <Suspense>{props.children}</Suspense>
    </>
  );
}
