import {UIIcon, UILink} from "com/ui";

/**
 * Header inside content
 *
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 * @param {string} [props.title]
 * @param {string} [props.titleIcon] An icon to prefix the title
 * @param {string} [props.href]
 */
export default function Header( props ) {
	let titlePrefix = props.titleIcon ? <UIIcon baseline small src={props.titleIcon} /> : null;

	return (
		<header class={props.class}>
			{props.title ? <h1><UILink href={props.href}>{titlePrefix}{props.title}</UILink></h1> : null}
			{props.children}
		</header>
	);
}
