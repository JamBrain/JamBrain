import cN from 'classnames';

export default function BodyLabel(props) {
	return <div {...props} class={cN("body -label", props.class)} />;
}
