import {h, Component, cloneElement}		from 'preact/preact';
import UIButton							from 'com/ui/button/button';		// specifically the button-button

export default class UIDropdown extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': props.show ? true : false,
		};

		this.onButton = this.onButton.bind(this);

		this.doShow = this.doShow.bind(this);
		this.doHide = this.doHide.bind(this);
	}

	doShow( e ) {
		this.setState({'show': true});
	}
	doHide( e ) {
		this.setState({'show': false});
	}

	// Clicking on the button
	onButton( e ) {
		if ( !this.state.show )
			this.doShow(e);
		else
			this.doHide(e);
	}

	render( props, state ) {
		let Button = props.children.slice(0, 1);

		let ShowContent = null;
		if ( state.show ) {
			let that = this;
			let Children = props.children.slice(1);

			let Content = [];
			for ( let idx = 0; idx < Children.length; idx++ ) {
				if ( Children[idx].attributes.onclick ) {
					Content.push(cloneElement(Children[idx], {
						'onclick': (e) => {
							that.doHide();
							Children[idx].attributes.onclick(e);
						}
					}));
				}
				else if ( Children[idx].attributes.href ) {
					Content.push(cloneElement(Children[idx], {
						'onclick': function(e) {
							that.doHide();
						}
					}));
				}
				else {
					Content.push(cloneElement(Children[idx]));
				}
			}

			ShowContent = [
				<div class="-content">
					{Content}
				</div>,
				<div class="-click-catcher" onclick={this.doHide} />
			];
		}

		let Classes = cN(
			'ui-dropdown',
			props.class,
			props.left ? '-left' : null,
			props.right ? '-right' : null
		);

		return (
			<div class={Classes} ref={(input) => { this.dropdown = input; }}>
				<UIButton class="-button" onclick={this.onButton}>{Button}</UIButton>
				{ShowContent}
			</div>
		);
	}
}
