
export default function BodyLabel(props) {
	return <div {...props} class={`body -label ${props.class ?? ''}`} />;
}
