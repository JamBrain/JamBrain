import { JSXElement, Suspense } from "solid-js";

export default function NodeDetails(props: { children: JSXElement }) {
  return (
    <Suspense fallback={<span class="text-xs whitespace-pre-wrap"> </span>}>
      <span class="text-gray-light text-xs font-light">{props.children}</span>
    </Suspense>
  );
}
