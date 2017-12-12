import {h, Component}					from 'preact/preact';

import UIIcon							from '../icon/icon';
import UIButton							from '../button/button';


export default class UIHelp extends Component {
	constructor( props ) {
		super(props);

		this.state = {
		};

		this.onClick = this.onClick.bind(this);
	}

	onClick( e ) {
		console.log(this.props.children);
	}

	render( props ) {
		return (
			<UIButton class={cN('ui-help', props.class)} onclick={this.onClick}>
				<UIIcon src="info" />
			</UIButton>
		);
	}
}
