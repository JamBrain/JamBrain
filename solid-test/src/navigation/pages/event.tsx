import { Suspense } from "solid-js";
import { EventNode } from "~/api/types";
import Nav from "~/components/Nav";
import { useRootNode } from "~/context/PageContext";

export default function EventLayout(props: { children: any }) {
  const node = useRootNode<EventNode>(() => ({
    refetchOnMount: false,
  }));

  return (
    <>
      <Nav>
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
      <Suspense fallback={<h1>Loading...</h1>}>{props.children}</Suspense>
    </>
  );
}
