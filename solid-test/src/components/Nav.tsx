import { useLocation } from "@solidjs/router";
import { For } from "solid-js";
import Button, { ButtonProps } from "./Button";

interface NavItem extends ButtonProps {}

export default function Nav(props: {
  children: NavItem[];
  viewTransitionName?: string;
}) {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "bg-neutral-50 text-primary" : "";

  return (
    <nav
      class="flex gap-2"
      style={{
        "view-transition-name": props.viewTransitionName,
      }}
    >
      <For each={props.children}>
        {(item) => (
          <Button
            {...item}
            class={`px-[1em] py-[0.125em] ${item.class} ${active(item.href)} hover:bg-primary hover:text-neutral-50`}
          />
        )}
      </For>
    </nav>
  );
}
