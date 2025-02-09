import "../app.css";
import MainHeader from "./MainHeader";
import { JSX } from "solid-js";
import Countdown from "./sidebar/Countdown";

export default function MainLayout(props: { children: JSX.Element }) {
  return (
    <>
      <header class="bg-gray-dark sticky top-0 z-10 px-4 [view-transition-name:main-header] select-none">
        <div class="mx-auto h-16 max-w-7xl">
          <MainHeader />
        </div>
      </header>

      <div class="bg-gray-light grow">
        <div class="mx-auto flex max-w-7xl gap-4 py-2">
          <main class="flex basis-3/4 flex-col gap-2 [view-transition-name:main-content]">
            {props.children}
          </main>
          <aside class="basis-1/4 [view-transition-name:main-sidebar]">
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
