import { Match, Show, Switch, createDeferred } from "solid-js";
import Icon from "./base/Icon";

export type ButtonProps = {
  title?: string;
  label?: string;
  icon?: string;
  class: string;
} & ({ href: string } | { onClick: () => void });

export default function Button(props: ButtonProps) {
  const isHrefSet = createDeferred(() => props.href != null);

  const inner = (
    <>
      <Show when={props.icon}>
        <Icon name={props.icon!} />
      </Show>
      <Show when={props.label}>
        <span>{props.label}</span>
      </Show>
    </>
  );

  return (
    <Switch
      fallback={
        <button
          onClick={props.onClick}
          title={props.title ?? props.label}
          class={`flex items-center gap-2 ${props.class}`}
        >
          {inner}
        </button>
      }
    >
      <Match when={isHrefSet()}>
        <a
          href={props.href}
          title={props.title ?? props.label}
          class={`flex items-center gap-2 ${props.class}`}
        >
          {inner}
        </a>
      </Match>
    </Switch>
  );
}
