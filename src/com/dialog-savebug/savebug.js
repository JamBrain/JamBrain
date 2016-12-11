import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogSavebug extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}
	
	render( props, {} ) {
		return (
			<DialogBase title="Oops!" ok>
				<div>Oops!! It looks like the website logged you out! This is a bug. :(</div>
				<div>As a workaround, Copy+paste your changes somewhere (a text editor), reload the page, login and try again. It should work.</div>
				<div>Sorry about this! It'll totally be fixed for next time. :D</div>
			</DialogBase>
		);
	}
}
