import { JSX, splitProps } from "solid-js";

export default function Icon(
  props: JSX.IntrinsicElements["svg"] & { name: string },
) {
  const [name, className, rest] = splitProps(props, ["name"], ["class"]);
  return (
    <svg
      {...rest}
      class={`inline-block size-[1em] fill-current ${className.class ?? ""}`}
    >
      <use href={`#${name.name}`} />
    </svg>
  );
}
