import "../app.css";
import MainHeader from "./MainHeader";
import { JSX } from "solid-js";
import Countdown from "./sidebar/Countdown";

export default function MainLayout(props: { children: JSX.Element }) {
  return (
    <>
      <header class="sticky top-0 z-10 select-none bg-gray-dark px-4">
        <div class="mx-auto h-16 max-w-7xl">
          <MainHeader />
        </div>
      </header>

      <div class="grow bg-gray-light">
        <div class="mx-auto flex max-w-7xl gap-4 py-2">
          <main class="flex basis-3/4 flex-col gap-2">{props.children}</main>
          <aside class="basis-1/4">
            <Countdown title="Ludum Dare 57" dateTime="2025-04-05T01:00:00Z" />
            TODO...
          </aside>
        </div>
      </div>

      <footer class="bg-gray-dark">
        <div class="max-w-7xl">TODO Footer</div>
      </footer>
    </>
  );
}
