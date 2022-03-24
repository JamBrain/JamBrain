import {h} from 'preact';
import cN from 'classnames';

export default function CommonAside( props ) {
	return <aside {...props} class={cN("content -common", props.class)} />;
}
