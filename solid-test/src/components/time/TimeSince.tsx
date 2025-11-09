import { Match, Switch, createDeferred } from "solid-js";
import { createSecondsSignal } from "~/lib/time";

// TODO feature parity with current system
export default function TimeSince(props: { dateTime: string }) {
  const now = createSecondsSignal();
  const then = createDeferred(() => (+new Date(props.dateTime) / 1000) | 0);
  const difference = createDeferred(() => now() - then());

  return (
    <time datetime={props.dateTime}>
      <Switch fallback={<>too long</>}>
        <Match when={difference() < 60}>just now</Match>
        <Match when={difference() < 2 * 60}>1 minute ago</Match>
        <Match when={difference() < 60 * 60}>
          {(difference() / 60) | 0} minutes ago
        </Match>
        <Match when={difference() < 2 * 60 * 60}>1 hour ago</Match>
        <Match when={difference() < 24 * 60 * 60}>
          {(difference() / 60 / 60) | 0} hours ago
        </Match>
        <Match when={difference() < 2 * 24 * 60 * 60}>one day ago</Match>
        <Match when={difference() < 7 * 24 * 60 * 60}>
          {(difference() / 24 / 60 / 60) | 0} days ago
        </Match>
        <Match when={difference() < 365 * 24 * 60 * 60}>
          {(difference() / 7 / 24 / 60 / 60) | 0} weeks ago
        </Match>
        {/* TODO months */}
        <Match when={difference() < 2 * 365 * 24 * 60 * 60 * 365}>
          {(difference() / 356 / 24 / 60 / 60) | 0} year ago
        </Match>
        <Match when={true}>
          {(difference() / 356 / 24 / 60 / 60) | 0} years ago
        </Match>
      </Switch>
    </time>
  );
}
