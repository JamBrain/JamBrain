export default function Icon(props: { name: string; class?: string }) {
  return (
    <svg class={`inline-block size-[1em] fill-current ${props.class ?? ""}`}>
      <use href={`#${props.name}`} />
    </svg>
  );
}
