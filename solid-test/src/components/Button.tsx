import { Match, Show, Switch, createDeferred, splitProps } from "solid-js";
import Icon from "./base/Icon";
import { A, AnchorProps } from "@solidjs/router";

export interface LinkButtonProps extends AnchorProps {
  title?: string;
  label?: string;
  icon?: string;
}

export type ActionButtonProps = {
  title?: string;
  label?: string;
  icon?: string;
  class: string;
  onClick: () => void;
};

export type ButtonProps = LinkButtonProps | ActionButtonProps;

export default function Button(props: ButtonProps) {
  const isHrefSet = createDeferred(() => props.href != null);

  const [local, others] = splitProps(props, [
    "title",
    "label",
    "icon",
    "class",
    "inactiveClass",
    "activeClass",
  ]);

  const inner = (
    <>
      <Show when={local.icon}>
        <Icon name={local.icon!} />
      </Show>
      <Show when={local.label}>
        <span>{local.label}</span>
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
        <A
          title={local.title ?? local.label}
          inactiveClass={`flex items-center gap-2 ${local.class} ${local.inactiveClass}`}
          activeClass={`flex items-center gap-2 ${local.class} ${local.activeClass}`}
          {...others}
        >
          {inner}
        </A>
      </Match>
    </Switch>
  );
}
