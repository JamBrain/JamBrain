import {h} from 'preact';

/**
 * Section inside content
 *
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 */
export default function Section( props ) {
	return <section {...props} />;
}
