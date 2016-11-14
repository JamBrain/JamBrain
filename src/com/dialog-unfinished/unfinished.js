import { h, Component } from 'preact/preact';

export default class DialogUnfinished extends Component {
	constructor() {
		this.state = {};
	}

	componentDidMount() {
	}
	
	render( props ) {
		return (
			<div style="color:#F00">:(</div>
		);
	}
}
