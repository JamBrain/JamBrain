import { JSXElement, Suspense } from "solid-js";

export default function NodeDetails(props: { children: JSXElement }) {
  return (
    <Suspense fallback={<span class="whitespace-pre-wrap text-xs"> </span>}>
      <span class="text-xs font-light text-gray-light">{props.children}</span>
    </Suspense>
  );
}
