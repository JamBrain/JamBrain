import {h} from 'preact';
import cN from 'classnames';

export default function Footer( props ) {
	let newClass = cN(props.nav ? "nav" : "", props.class);
	return <footer class={newClass} />;
}
