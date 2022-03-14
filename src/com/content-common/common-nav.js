import {h} from 'preact';
import cN from 'classnames';

export default function BodyNav( props ) {
	return <div {...props} class={cN("body -nav", props.class)} />;
}
