import {h} from 'preact';
import cN from 'classnames';

export default function CommonHeader( props ) {
	return <header {...props} class={cN("content -common", props.class)} />;
}
