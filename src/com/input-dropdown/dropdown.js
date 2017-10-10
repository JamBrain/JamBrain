import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class InputDropdown extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': props.startExpanded,
			'value': props.value ? props.value : 0
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
			// Don't show if only 1 item
			if ( this.props.items && this.props.items.length > 1 ) {
				this.doShow(e);
			}
		}
		else {
			this.doHide(e);
		}
	}

	// Clicking outside the button and items
	onHide( e ) {
		if ( this.dropdown != e.target.closest('.input-dropdown') ) {
			this.doHide(e);
		}
	}

	// Clicking on an item
	onClickItem( e ) {
		// Only do click if the item has an index (i.e. not a separator)
		if ( e.target.dataset.hasOwnProperty('index') ) {
			if ( this.props.onmodify ) {
				this.props.onmodify(parseInt(e.target.dataset.id));
			}

			this.setState({'value': parseInt(e.target.dataset.index)});
			this.doHide(e);
		}
	}

	render( props, {show, value} ) {
		if ( props.items && props.items.length ) {
			let ClickCatcher = null;
			let ShowItems = null;
			if ( show ) {
				ShowItems = [];

				let idx = 0;
				props.items.forEach((item) => {

					if (props.useClickCatcher) {
						ClickCatcher = (
							<div
								class="-click-catcher"
								onclick={this.onClickItem}
								data-index={idx}
								data-id={item[0]}
							/>
						);
					} else {
						ClickCatcher = null;
					}

					ShowItems.push(
						<div class="-item"
							onclick={this.onClickItem}
							data-index={idx++}
							data-id={item[0]}
						>
							{item[1]}
							{ClickCatcher}
						</div>
					);
				});

				ShowItems = (
					<div class="-items">
						{ShowItems}
					</div>
				);
			}

			let SelectedField = null;
			if (!props.hideSelectedField) {

				SelectedField = (
					<button type="button" onclick={this.onShow}>
						{props.items[value][1]}
					</button>

				);
			}

			return (
				<div class={cN('input-dropdown', props.class)} ref={(input) => { this.dropdown = input; }}>
					{SelectedField}
					{ShowItems}
				</div>
			);
		}

		return <div />;
	}
}
