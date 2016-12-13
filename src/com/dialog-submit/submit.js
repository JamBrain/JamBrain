import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogSubmit extends Component {
	constructor( props ) {
		super(props);
		
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
	}
	
	onClick( e ) {
		window.location.href = window.location.pathname;
	}
	
	render( props, {} ) {
		return (
			<DialogBase title="Publish Game" ok explicit onclick={this.onClick}>
				<div>Game Successsfully Published :D</div>
			</DialogBase>
		);
	}
}
