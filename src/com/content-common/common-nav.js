export default function BodyNav( props ) {
	return <div {...props} class={`body -nav ${props.class ?? ''}`} />;
}
