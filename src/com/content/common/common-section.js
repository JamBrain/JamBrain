import {h} from 'preact';
import cN from 'classnames';

export default function CommonSection( props ) {
	return <section {...props} class={cN("content -common", props.class)} />;
}
