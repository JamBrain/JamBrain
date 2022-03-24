import {h} from 'preact';
import cN from 'classnames';

export default function CommonFooter( props ) {
	return <footer {...props} class={cN("content -common", props.class)} />;
}
