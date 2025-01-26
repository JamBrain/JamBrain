import { JSXElement, Show } from "solid-js";
import Avatar from "./Avatar";
import Icon from "./base/Icon";

export default function Content(props: {
  children: JSXElement;
  header: JSXElement;
  author?: number;
  flag?: {
    text?: string;
    icon?: string;
    color: string;
  };
}) {
  return (
    <article class="text-gray bg-white">
      <Show when={props.author != null}>
        <Avatar user={props.author!} class="float-right mt-2 mr-2 ml-1" />
      </Show>
      <header
        class={`flex items-baseline justify-stretch ${props.author == null ? "pr-4" : ""}`}
      >
        <Show when={props.flag != null}>
          <h2
            class={`\ -mr-2 mb-3 flex items-center gap-2 py-3 pr-9 pl-4 text-2xl font-bold text-white uppercase italic
              ${props.flag?.color} cut-br`}
          >
            {/* TODO revert order without messing up baseline */}
            <Show when={props.flag!.text != null}>{props.flag!.text}</Show>
            <Show when={props.flag!.icon != null}>
              <Icon name={props.flag!.icon!} />
            </Show>
          </h2>
        </Show>
        <div
          class={`flex grow flex-col items-start justify-stretch ${props.flag == null ? "mt-4 pl-4" : ""}`}
        >
          {props.header}
        </div>
      </header>
      <main class="px-4">{props.children}</main>
    </article>
  );
}
