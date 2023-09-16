import { Component } from 'preact';
import './help.module.less';

import {Icon} from './icon';
import {Button} from './button';
import {Dialog} from './dialog';

export class Help extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': false,
		};

		this.onShow = this.onShow.bind(this);
		this.onHide = this.onHide.bind(this);
	}

	onShow( e ) {
		//console.log('t');
		this.setState({'show': true});
	}
	onHide( e ) {
		//console.log('h');
		this.setState({'show': false});
	}

	render( props, state ) {
		let ShowDialog = null;
		if ( state.show ) {
			ShowDialog = <Dialog class="-dialog" oncancel={this.onHide}>{props.children}</Dialog>;
		}

		return (
			<div class={`ui-help ${props.class ?? ''}`}>
				<Button class="-button" onClick={this.onShow}><Icon src="question" /></Button>
				{ShowDialog}
			</div>
		);
	}
}
