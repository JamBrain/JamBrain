import {Component} from 'preact';

export default class ContentList extends Component {
	render( props ) {
		return <>{props.children}</>;

/*
		return (
			<section {...props} class={cN("content -list", props.class)}>
				{props.children}
			</section>
		);
*/
	}
}
