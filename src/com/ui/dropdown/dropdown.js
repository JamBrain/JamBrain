import {h, Component}	 				from 'preact/preact';
import {shallowDiff}	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class UIDropdown extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': props.startOpen ? true : false,
		};

		this.onClickItem = this.onClickItem.bind(this);

		this.onShow = this.onShow.bind(this);
		this.onHide = this.onHide.bind(this);
	}

	doShow( e ) {
		this.setState({'show': true});
		document.addEventListener('click', this.onHide);
	}
	doHide( e ) {
		this.setState({'show': false});
		document.removeEventListener('click', this.onHide);
	}

	// Clicking on the button
	onShow( e ) {
		if ( !this.state.show ) {
			this.doShow(e);
		}
		else {
			this.doHide(e);
		}
	}

	// Clicking outside the button and items
	onHide( e ) {
		if ( this.dropdown != e.target.closest('.ui-dropdown') ) {
			this.doHide(e);
		}
	}

	render( props, state ) {
		let ButtonContent = null;

		console.log(props.children);

		let BodyContent = null;
		if ( state.show ) {
			BodyContent = (
				<div class="-content">
					{ShowItems}
				</div>
			);
		}

		return (
			<div class={cN('ui-dropdown', props.class)} ref={(input) => { this.dropdown = input; }}>
				<button type="button" onclick={this.onShow}>
					{ButtonContent}
				</button>
				{BodyContent}
			</div>
		);
	}
}
