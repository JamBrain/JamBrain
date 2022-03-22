import {h} from 'preact';
import cN from 'classnames';
import {CommonHeader, CommonFooter} from "com/content/common";

export default function ContentSimple( props ) {
	let Tag = props.article ? "article" : props.aside ? "aside" : "div";

	return (
		<Tag {...props} class={cN("content -common -simple", props.class)}>
			{props.title ? <CommonHeader title={props.title} href={props.href} /> : null}
			{props.children}
			{props.footer ? <CommonFooter {...(props.footer)} /> : null}
		</Tag>
	);
}
