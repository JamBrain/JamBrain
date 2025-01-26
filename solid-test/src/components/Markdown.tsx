import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { createResource } from "solid-js";
import { toStatic } from "~/lib/assets";

function postprocess(html: string) {
  return DOMPurify.sanitize(html);
}

marked.use({
  hooks: { postprocess },
});

marked.use({
  renderer: {
    image(href, title, text) {
      href =
        toStatic(href) ?? toStatic("///content/internal/pleaseupload.png")!;
      return title
        ? `<img src="${href}" alt="${text}">`
        : `<img src="${href}" alt="${text}" title="${title}">`;
    },
  },
});

// TODO write component test to ensure DOMPurify works
// TODO innerHTML gets updated too often (leads to flickering in Safari)
export default function Markdown(props: { content: string; class: string }) {
  const [html] = createResource(
    () => props.content,
    (markdown) => {
      return marked.parse(markdown, {
        gfm: true,
        async: true,
      });
    },
  );

  return (
    <div
      class={`prose prose-lg prose-p:my-3
        prose-a:text-primary
        prose-a:no-underline prose-a:hover:bg-primary prose-a:hover:text-white prose-img:mx-auto
        prose-img:my-3 max-w-none
        ${props.class}`}
      innerHTML={html()}
    ></div>
  );
}
