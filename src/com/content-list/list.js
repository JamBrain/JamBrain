import {h, Component, Fragment} from 'preact';
import cN from 'classnames';

export default class ContentList extends Component {
	render( props ) {
		return <Fragment>{props.children}</Fragment>;

/*
		return (
			<section {...props} class={cN("content -list", props.class)}>
				{props.children}
			</section>
		);
*/
	}
}
