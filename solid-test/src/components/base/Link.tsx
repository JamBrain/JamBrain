export default function Link(props) {
  return (
    <a {...props} class={`hover:bg-primary hover:text-white ${props.class}`}>
      {props.children}
    </a>
  );
}
