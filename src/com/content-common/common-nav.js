import {h} from 'preact';

export default function BodyNav( props ) {
	return <div {...props} class={cN("body -nav", props.class)} />;
}
