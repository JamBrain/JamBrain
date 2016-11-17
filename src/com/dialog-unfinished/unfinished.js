import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogUnfinished extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}
	
	render( props ) {
		return (
			<DialogBase title="Unavailable" ok>
				<div>Sorry. This feature is unavailable at this time.</div>
			</DialogBase>
		);
	}
}
