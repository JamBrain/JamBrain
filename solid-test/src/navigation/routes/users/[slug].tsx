import { RouteSectionProps, useParams } from "@solidjs/router";
import Nav, { NavItem } from "~/components/Nav";

export default function Users(props: RouteSectionProps) {
  const params = useParams();

  return (
    <div class="flex flex-col gap-2">
      <Nav viewTransitionName="main-nav">
        <NavItem href="/" end title="Go Back" icon="icon-previous" />
        <NavItem
          href={`/users/${params.slug}`}
          end
          label={params.slug}
          icon="icon-user"
          variant="outline"
        />
        <NavItem
          href={`/users/${params.slug}/games`}
          label="Games"
          icon="icon-gamepad"
        />
        <NavItem
          href={`/users/${params.slug}/feed`}
          label="Feed"
          icon="icon-feed"
        />
      </Nav>
      {/* TODO add suspense back when this is moved to pages */}
      {props.children}
    </div>
  );
}
