export default function Link(props) {
  return (
    <a
      {...props}
      class={`hover:bg-primary hover:text-neutral-50 ${props.class}`}
    >
      {props.children}
    </a>
  );
}
