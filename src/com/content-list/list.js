import {h, Component}					from 'preact/preact';

export default class ContentList extends Component {
	render( props ) {
		return (
			<div class={cN("content-base content-list", props.class)}>
				{props.children}
			</div>
		);
	}
}
