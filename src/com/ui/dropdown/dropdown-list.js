import { Component } from 'preact';

import {UIButton} from '../button';
import {UIDropdown} from './dropdown';

export default class UIDropdownList extends Component {
	constructor( props ) {
		super(props);
	}

	// Does not need to be bound in constructor
	onModify( value, index ) {
		if ( this.props.onModify ) {
			this.props.onModify(value, index);
		}
	}

	render( props ) {
		if ( !props.items || !props.items.length )
			return null;

		let NewProps = {
			'class': `ui-dropdown-list ${props.class ?? ''}`,

			// Passthrough here
			'show': props.show,
			'right': props.right,
			'left': props.left,
			'tick': props.tick ? props.tick : true,		// default is "show the tick"
		};

		let Value = null;
		let Items = [];

		// Detect what sort of input we're getting

		// Array of pairs: [ value_to_return, value_to_display ]
		if ( props.items[0].length >= 2 ) {
			for ( let idx = 0; idx < props.items.length; idx++ ) {
				let itemValue = props.items[idx][0];
				let itemName = props.items[idx][1];

				if ( itemValue !== null ) {
					if ( itemValue == props.value )
						Value = <div>{itemName}</div>;

					Items.push(
						<UIButton class="-item" onClick={this.onModify.bind(this, itemValue, idx)}>
							{itemName}
						</UIButton>
					);
				}
				else {
					Items.push(
						<div class="-null">
							{itemName}
						</div>
					);
				}
			}
		}
		// ID & Name pair: { 'id': 10, 'name': "Monkey" }
		else if ( props.items[0].id && props.items[0].name ) {
			for ( let idx = 0; idx < props.items.length; idx++ ) {
				let itemValue = props.items[idx].id;
				let itemName = props.items[idx].name;

				if ( itemValue == props.value )
					Value = <div>{itemName}</div>;

				Items.push(
					<UIButton class="-item" onClick={this.onModify.bind(this, itemValue, idx)}>
						{itemName}
					</UIButton>
				);
			}
		}

		return (
			<UIDropdown {...NewProps}>
				{Value}
				{Items}
			</UIDropdown>
		);
	}
}
