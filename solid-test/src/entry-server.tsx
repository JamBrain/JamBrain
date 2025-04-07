// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import DOMPurify from "isomorphic-dompurify";

// TODO generate svg
const svgBundle = DOMPurify.sanitize(
  await (await fetch("https://ldjam.com/-/all.min.svg?v=5103-d21901d")).text(),
);

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div aria-hidden class="hidden" innerHTML={svgBundle} />
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
