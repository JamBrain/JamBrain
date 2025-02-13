import { Suspense } from "solid-js";
import { EventNode } from "~/api/types";
import Link from "~/components/base/Link";
import Content from "~/components/Content";
import Nav, { NavItem } from "~/components/Nav";
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
        <NavItem href="/" end title="Go Back" icon="icon-previous" />
        <NavItem
          href={node.data!.path}
          end
          label={node.data!.name}
          icon="icon-trophy"
          variant="outline"
        />
        <NavItem
          href={`${node.data!.path}/results`}
          label="Results"
          icon="icon-gamepad"
        />
        <NavItem
          href={`${node.data!.path}/games`}
          label="Games"
          icon="icon-gamepad"
        />
        <NavItem
          href={`${node.data!.path}/theme`}
          label="Theme"
          icon="icon-ticket"
        />
        <NavItem
          href={`${node.data!.path}/stats`}
          label="Stats"
          icon="icon-stats"
        />
      </Nav>
      <Suspense>{props.children}</Suspense>
    </>
  );
}
