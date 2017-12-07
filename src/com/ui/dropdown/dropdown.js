import {h, Component}	 				from 'preact/preact';
import UIButton							from 'com/ui/button/button';		// specifically the button-button

export default class UIDropdown extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': props.startOpen ? true : false,
		};

		this.onShow = this.onShow.bind(this);
		this.onHide = this.onHide.bind(this);

		this.doShow = this.doShow.bind(this);
		this.doHide = this.doHide.bind(this);
	}

	doShow( e ) {
		this.setState({'show': true});
//		document.addEventListener('click', this.onHide);
	}
	doHide( e ) {
		this.setState({'show': false});
//		document.removeEventListener('click', this.onHide);
	}

	// Clicking on the button
	onShow( e ) {
		if ( !this.state.show )
			this.doShow(e);
		else
			this.doHide(e);
	}
	// Clicking outside the button and items
	onHide( e ) {
		if ( this.dropdown != e.target.closest('.ui-dropdown') ) {
			this.doHide(e);
		}
	}

	render( props, state ) {
		let Button = props.children.slice(0, 1);
		let Body = [];
		if ( state.show ) {
			Body.push(<div class="-content">{props.children.slice(1)}</div>);
			Body.push(<div class="-click-catcher" onclick={this.doHide} />);
		}

		let Classes = cN(
			'ui-dropdown',
			props.class,
			props.left ? '-left' : null,
			props.right ? '-right' : null
		);

		return (
			<div class={Classes} ref={(input) => { this.dropdown = input; }}>
				<UIButton class="-button" onclick={this.onShow}>{Button}</UIButton>
				{Body}
			</div>
		);
	}
}
