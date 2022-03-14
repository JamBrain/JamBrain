import {h} from 'preact';
import cN from 'classnames';
import {CommonHeader, CommonFooter} from "com/content/common";

export default function ContentSimple(props) {
	return (
		<div {...props} class={cN("content -common -simple", props.class)}>
			{props.title ? <CommonHeader title={props.title} href={props.href} /> : null}
			{props.children}
			<CommonFooter />
		</div>
	);
}
