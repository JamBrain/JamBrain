import { Component } from 'preact';

export default class ViewContent extends Component {
	render( props ) {
		return (
			<div id="content" role="none">
				{props.children}
			</div>
		);
	}
}
