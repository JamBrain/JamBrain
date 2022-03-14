import {h, Component} from 'preact';
import cN from 'classnames';

import UIIcon from '../icon';
import UIButton from '../button';
import UIDialog from '../dialog';

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
				<UIButton class="-button" onClick={this.onShow}><UIIcon src="question" /></UIButton>
				{ShowDialog}
			</div>
		);
	}
}
