import { JSX, Show, splitProps } from "solid-js";
import Icon from "./Icon";

const customizableSelectSupported = CSS.supports("appearance", "base-select");

export default function Select(props: JSX.IntrinsicElements["select"]) {
  const [className, rest] = splitProps(props, ["class"]);
  return (
    <select
      {...rest}
      // picker is styled in global app.css file
      class={`${className.class} [appearance:base-select] items-center justify-between rounded-sm border-1 border-neutral-200 bg-neutral-100 px-2 py-2 [&::picker-icon]:hidden`}
    >
      {/* https://github.com/solidjs/solid/discussions/2463 */}
      <Show when={customizableSelectSupported}>
        <button>
          <selectedcontent class="flex items-center gap-2" />
          <Icon name="icon-hamburger" aria-hidden />
        </button>
      </Show>
      {props.children}
    </select>
  );
}

export function Option(
  props: JSX.IntrinsicElements["option"] & { icon?: string },
) {
  const [icon, label, rest] = splitProps(props, ["icon"], ["children"]);
  return (
    <option
      {...rest}
      class="hover:bg-primary px-2 py-2 checked:bg-neutral-100 hover:text-neutral-50 [&::checkmark]:hidden"
    >
      {icon.icon && <Icon name={icon.icon} aria-hidden />}
      {label.children}
    </option>
  );
}
