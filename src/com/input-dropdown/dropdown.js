import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class InputDropdown extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'show': false,
			'value': 0
		};
		
		this.onClick = this.onClick.bind(this);
		
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
	
	onShow( e ) {
		console.log('drop');
		// Don't show if only 1 item
		if ( this.props.items && this.props.items.length > 1 ) {
			this.doShow(e);
		}
	}
	
	onHide( e ) {
		window.boo = e.target;
		console.log('blur', this.dropdown, e.target.closest('.input-dropdown'));
		
		if ( this.dropdown != e.target.closest('.input-dropdown') ) {
			this.doHide(e);
//			preventDefault();
		}
	}
	
	onClick( e ) {
		console.log(e);
		this.doHide(e);
	}
	
	render( props, {show, value} ) {
		if ( props.items && props.items.length ) {
			let ShowItems = null;
			if ( show ) {
				ShowItems = [];
				
				props.items.forEach(function(item) {
					ShowItems.push(
						<div class="-item" onclick={this.onClick} alt={item[0]}>{item[1]}</div>
					);
				});
				
				ShowItems = (
					<div class="-items">
						{ShowItems}
					</div>				
				);
			}
	
			return (
				<div class="input-dropdown" ref={(input) => { this.dropdown = input; }}>
					<button type="button" onclick={this.onShow}>
						{props.items[value][1]}
					</button>
					{ShowItems}
				</div>
			);
		}

		return <div />;
	}
}
