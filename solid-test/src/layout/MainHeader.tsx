import { clientOnly } from "@solidjs/start";
import { Suspense } from "solid-js";

const UserMenu = clientOnly(() => import("./user/UserMenu"));

export default function MainHeader() {
  return (
    <div class="flex h-full items-stretch justify-between">
      <a
        class="group hover:bg-primary flex gap-3 p-3"
        title="Ludum Dare"
        href="/"
      >
        <svg class="fill-primary w-[11.19rem] group-hover:fill-white">
          <use href="#icon-ludum" />
        </svg>
        <svg class="fill-secondary group-hover:fill-highlight w-[7.56rem]">
          <use href="#icon-dare" />
        </svg>
      </a>
      <nav class="text-primary m-2 flex items-stretch gap-2">
        <Suspense>
          <UserMenu />
        </Suspense>
      </nav>
    </div>
  );
}
