import {h} from "preact";
//import cN from "classnames";
import {UIIcon, UILink} from "com/ui";

export default function Header( props ) {
	let titlePrefix = props.titleIcon ? <UIIcon baseline small src={props.titleIcon} /> : null;

	return (
		<header class={props.class}>
			{props.title ? <h1><UILink href={props.href}>{titlePrefix}{props.title}</UILink></h1> : null}
			{props.children}
		</header>
	);
}
