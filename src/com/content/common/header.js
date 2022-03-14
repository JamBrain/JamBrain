import {h} from "preact";
import cN from "classnames";
import {UIIcon, UILink} from "com/ui";

export default function CommonHeader(props) {
	let titlePrefix = props.titleIcon ? <UIIcon baseline small src={props.titleIcon} /> : null;
	return (
		<div class={cN("header", props.class)}>
			{props.title ? <UILink href={props.href}>{titlePrefix}{props.title}</UILink> : null}
			{props.children}
		</div>
	);
}
