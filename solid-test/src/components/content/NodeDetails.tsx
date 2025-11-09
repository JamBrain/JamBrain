import { JSXElement, Suspense } from "solid-js";

export default function NodeDetails(props: { children: JSXElement }) {
  return (
    <Suspense fallback={<span class="text-xs whitespace-pre-wrap"> </span>}>
      <span class="text-xs font-light text-neutral-500">{props.children}</span>
    </Suspense>
  );
}
