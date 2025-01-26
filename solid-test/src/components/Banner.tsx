import { Show, createSignal } from "solid-js";
import Icon from "./base/Icon";
import Link from "./base/Link";

export default function Banner() {
  const [hidden, setHidden] = createSignal(false);

  return (
    <Show when={!hidden()}>
      <article class="bg-gray px-4 py-3 text-white">
        <div class="mb-3 flex items-start justify-between">
          <h1 class="font-header text-highlight text-3xl font-bold">
            What is Ludum Dare?
          </h1>
          <button onclick={() => setHidden(true)} class="hover:text-primary">
            <Icon name="icon-cross" />
          </button>
        </div>
        <div>
          <Link href="/about" class="text-secondary">
            <strong>Ludum Dare</strong>
          </Link>{" "}
          is an online event where games are made from scratch in a weekend.
          Check us out every April and October!
        </div>
      </article>
    </Show>
  );
}
