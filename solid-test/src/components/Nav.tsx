import { createDeferred, JSX, splitProps } from "solid-js";
import Button, { LinkButtonProps } from "./Button";

export default function Nav(props: {
  children: JSX.Element[];
  viewTransitionName?: string;
}) {
  return (
    <nav
      class="flex gap-2"
      style={{
        "view-transition-name": props.viewTransitionName,
      }}
    >
      {props.children}
    </nav>
  );
}

export function NavItem(
  props: LinkButtonProps & {
    variant?: "outline" | "active" | "default";
  },
) {
  const [local, others] = splitProps(props, ["variant"]);

  const className = createDeferred(() => {
    switch (local.variant) {
      case "active":
        return "bg-neutral-50 text-neutral-900";
      case "outline":
        return "border-1 text-neutral-50 border-neutral-50 hover:border-primary";
      default:
        return "bg-neutral-400 text-neutral-700";
    }
  });

  return (
    <Button
      {...others}
      class={`px-[1em] py-[0.5em] font-bold ${others.class ?? ""} hover:bg-primary hover:text-neutral-50`}
      inactiveClass={className()}
      activeClass="bg-neutral-50 text-neutral-900"
    />
  );
}
