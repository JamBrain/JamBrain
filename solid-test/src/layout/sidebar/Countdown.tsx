import { createSecondsSignal } from "~/lib/time";
import SplitFlap from "./SplitFlap";
import { Index, Show } from "solid-js";

export default function Countdown(props: { title: string; dateTime: string }) {
  // TODO offset by half second to better align with animation
  const now = createSecondsSignal();
  const then = () => (+new Date(props.dateTime) / 1000) | 0;
  const diff = () => then() - now();

  const days = () => (diff() / 24 / 60 / 60) | 0;
  const hours = () => ((diff() / 60 / 60) | 0) % 24;
  const minutes = () => ((diff() / 60) | 0) % 60;
  const seconds = () => diff() % 60;

  return (
    <div class="flex flex-col items-center gap-2 uppercase perspective-midrange perspective-origin-left transform-3d">
      <h1 class="font-header text-2xl text-white">
        {props.title} <strong>Starts</strong>
      </h1>
      <div class="flex gap-2 transform-3d">
        <Show when={days() > 0}>
          <Part unit="days" value={days()} />
        </Show>
        <Part unit="hours" value={hours()} minLength={2} />
        <Part unit="minutes" value={minutes()} minLength={2} />
        <Part unit="seconds" value={seconds()} minLength={2} />
      </div>
    </div>
  );
}

function Part(props: { unit: string; value: number; minLength?: number }) {
  const pad = Math.max(props.minLength ?? 0, props.value.toString().length);

  return (
    <div class="flex flex-col-reverse items-center gap-1 transform-3d">
      <div class="text-gray flex gap-0.5 transform-3d">
        <Index each={props.value.toString().padStart(pad).split("")}>
          {(item) => <SplitFlap value={+item()} />}
        </Index>
      </div>
      <span class="text-sm font-semibold text-[#b9c4d0]">{props.unit}</span>
    </div>
  );
}
