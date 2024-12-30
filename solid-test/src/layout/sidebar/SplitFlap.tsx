import classes from "./split-flap.module.css";
import { createEffect } from "solid-js";

export default function SplitFlap(props: { value: number }) {
  let myElement: HTMLSpanElement;

  function removeAnimationClasses() {
    // sometimes not all classes were removed when the tab was inactive
    // therefore we remove all possible classes
    for (let i = 0; i < 10; i++) {
      myElement!.classList.remove(classes[`from-${i}`]);
      myElement!.classList.remove(classes[`to-${i}`]);
    }
  }

  createEffect((from) => {
    if (from != null) {
      removeAnimationClasses();
      // https://css-tricks.com/restart-css-animation/
      void myElement!.offsetWidth;

      myElement!.classList.add(classes[`to-${props.value}`]);
      if (from != null) {
        myElement!.classList.add(classes[`from-${from}`]);
      }
    }
    return props.value;
  }, null);

  return (
    <span
      ref={myElement!}
      class={`h-[41px] w-[37px] rounded
        bg-gradient-to-b from-white from-50% to-TODO2 to-50%
        text-center text-2xl font-bold leading-[41px]
        ${classes["split-flap"]}`}
      onanimationend={removeAnimationClasses}
    >
      {props.value}
    </span>
  );
}
