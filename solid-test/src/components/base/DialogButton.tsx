import { JSX, createSignal } from "solid-js";
import Dialog from "./Dialog";
import Button from "../Button";

export interface ButtonProps {
  title?: string;
  label?: string;
  icon?: string;
  class: string;
  dialog(props: { close: () => void }): JSX.Element;
}

export default function DialogButton(props: ButtonProps) {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        label={props.label}
        class={`flex items-center gap-2 ${props.class}`}
      />
      <Dialog open={open()} onCancel={() => setOpen(false)}>
        <props.dialog close={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
