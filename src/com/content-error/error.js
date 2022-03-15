import {h} from 'preact';

export default function ContentError( props ) {
	let errorCode = props.code ? props.code : '404';

	return (
		<article class="content -error">
			<h1>{errorCode}</h1>
			{props.children}
		</article>
	);
}
