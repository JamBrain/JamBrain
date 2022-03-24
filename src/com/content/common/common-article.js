import {h} from 'preact';
import cN from 'classnames';

export default function CommonArticle( props ) {
	return <article {...props} class={cN("content -common", props.class)} />;
}
