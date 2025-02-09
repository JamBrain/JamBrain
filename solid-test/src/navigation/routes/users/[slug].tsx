import { RouteSectionProps, useParams } from "@solidjs/router";
import Nav from "~/components/Nav";

export default function Users(props: RouteSectionProps) {
  const params = useParams();

  return (
    <div class="flex flex-col gap-2">
      <Nav viewTransitionName="main-nav">
        {[
          { href: "/", title: "Go Back", icon: "icon-previous" },
          {
            href: `/users/${params.slug}`,
            label: params.slug,
            icon: "icon-user",
            class: "border-2 border-white",
          },
          {
            href: `/users/${params.slug}/games`,
            label: "Games",
            icon: "icon-gamepad",
          },
          {
            href: `/users/${params.slug}/feed`,
            label: "Feed",
            icon: "icon-feed",
          },
        ]}
      </Nav>
      {/* TODO add suspense back when this is moved to pages */}
      {props.children}
    </div>
  );
}
