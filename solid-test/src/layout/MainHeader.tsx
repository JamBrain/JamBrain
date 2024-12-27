import { clientOnly } from "@solidjs/start";
import { Suspense } from "solid-js";

const UserMenu = clientOnly(() => import("./user/UserMenu"));

export default function MainHeader() {
  return (
    <div class="flex h-full items-stretch justify-between">
      <a
        class="group flex gap-3 p-3 hover:bg-primary"
        title="Ludum Dare"
        href="/"
      >
        <svg class="w-[11.19rem] fill-primary group-hover:fill-white">
          <use href="#icon-ludum" />
        </svg>
        <svg class="w-[7.56rem] fill-secondary group-hover:fill-highlight">
          <use href="#icon-dare" />
        </svg>
      </a>
      <nav class="m-2 flex items-stretch gap-2 text-primary">
        <Suspense>
          <UserMenu />
        </Suspense>
      </nav>
    </div>
  );
}
