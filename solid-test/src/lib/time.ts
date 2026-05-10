import { createSignal, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";

const [seconds, setSeconds] = createSignal((Date.now() / 1000) | 0);

let refCount = 0;
let animationFrame = 0;

function step() {
  // update animationFrame before cleanup could be called from setSeconds side effect
  animationFrame = requestAnimationFrame(step);
  setSeconds((Date.now() / 1000) | 0);
}

function startLoop() {
  animationFrame = requestAnimationFrame(step);
}

function stopLoop() {
  cancelAnimationFrame(animationFrame);
}

export function createSecondsSignal() {
  if (!isServer) {
    if (refCount++ === 0) startLoop();
    onCleanup(() => {
      if (--refCount === 0) stopLoop();
    });
  }

  return seconds;
}
