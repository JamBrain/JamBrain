import {h} 				from 'preact';
import cN				from 'classnames';

export default function ContentCommonDraft( props ) {
	return <div class={cN(props.class, "draft")}>Unpublished {props.draft ? props.draft : "Draft"}</div>;
}
