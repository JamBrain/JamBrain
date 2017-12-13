import {h, Component}					from 'preact/preact';

import UIIcon							from '../icon/icon';
import UIButton							from '../button/button';
import UIDialog							from '../dialog/dialog';

export default class UIHelp extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': false,
		};

		this.onShow = this.onShow.bind(this);
		this.onHide = this.onHide.bind(this);
	}

	onShow( e ) {
		console.log('t');
		this.setState({'show': true});
	}
	onHide( e ) {
		console.log('h');
		this.setState({'show': false});
	}

	render( props, state ) {
		let ShowDialog = null;
		if ( state.show ) {
			ShowDialog = <UIDialog class="-dialog" oncancel={this.onHide}>{props.children}</UIDialog>;
		}

		return (
			<div class={cN('ui-help', props.class)}>
				<UIButton class="-button" onclick={this.onShow}><UIIcon src="question" /></UIButton>
				{ShowDialog}
			</div>
		);
	}
}
