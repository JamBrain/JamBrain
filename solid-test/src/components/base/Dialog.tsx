import { JSX, createEffect } from "solid-js";

export default function Dialog(props: {
  open: boolean;
  children: JSX.Element;
  onCancel?: () => void;
}) {
  let ref: HTMLDialogElement;

  createEffect(() => {
    if (props.open) {
      ref.showModal();
    } else {
      ref.close();
    }
  });

  function onCancel(e: Event) {
    if (props.onCancel != null) {
      props.onCancel();
    } else {
      e.preventDefault();
    }
  }

  return (
    <dialog
      ref={ref!}
      onCancel={onCancel}
      class="backdrop:bg-gray-dark backdrop:opacity-75"
    >
      {props.children}
    </dialog>
  );
}
