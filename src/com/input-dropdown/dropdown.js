import {h, Component} 				from 'preact/preact';

import OptionsList from 'com/input-dropdown/options';

export default class InputDropdown extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'value': props.value ? props.value : props.items[0][0],
		};

		this.onClickItem = this.onClickItem.bind(this);

		this.onShow = this.onShow.bind(this);
		this.onHide = this.onHide.bind(this);
	}

	componentWillReceiveProps( nextProps ) {
		this.props = nextProps;
		let { value } = this.state;
		if (nextProps.value != undefined) {
			value = nextProps.value;
		}
		this.setState({
			'show': false,
			'value': value,
		});
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

	onClickItem( e ) {
		e.preventDefault();
		const nextSelected = e.target.dataset.id;
		const selected = this.state.value;
		if ( nextSelected != selected ) {

			if ( this.props.onmodify ) {
				this.props.onmodify(e);
			}
			else {
				this.setState({'value': nextSelected});
				this.doHide(e);
			}
		}
		else {
			this.doHide(e);
		}
	}

	render( props, {show, value} ) {
		if ( props.items && props.items.length ) {
			let {selfManaged, useClickCatcher} = props;
			let ClickCatcher = null;
			let ShowItems = null;
			let SelectedField = null;

			if ( !props.hideSelectedField) {
				props.items.forEach(([dataId, Contents, Overlay]) => {
					if ( dataId == value ) {
						SelectedField = (
							<button type="button" onclick={this.onShow}>
								{Contents}
							</button>
						);
					}
				});
				if (SelectedField == null) {
					SelectedField = (
						<button type="button" onclick={this.onShow}>
							{props.items[0][1]}
						</button>
					);
				}
			}

			if ( show ) {
				ShowItems = (<OptionsList items={props.items} onClickItem={this.onClickItem} />);
			}

			return (
				<div
					class={cN('input-dropdown', props.class)}
					ref={
						(input) => { this.dropdown = input; }
					}
				>
					{SelectedField}
					{ShowItems}
				</div>
			);
		}

		return <div />;
	}
}
