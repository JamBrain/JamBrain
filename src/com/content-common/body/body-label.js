import {h} from 'preact';

export default function BodyLabel(props) {
	return <div {...props} class={cN("body -label", props.class)} />;
}
