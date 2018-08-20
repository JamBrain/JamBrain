import {h, Component}	 				from 'preact/preact';
import {shallowDiff}	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class InputDropdown extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': false,
			'value': props.value ? props.value : 0
		};

		this.onClickItem = this.onClickItem.bind(this);

		this.onShow = this.onShow.bind(this);
		this.onHide = this.onHide.bind(this);
		this.doShow = this.doShow.bind(this);
	}

	doShow( e ) {
		this.setState({'show': true});
		document.addEventListener('click', this.onHide);
	}

	doHide( e ) {
		this.setState({'show': false});
		document.removeEventListener('click', this.onHide);
		if (this.props.onhide) this.props.onhide(e);
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
		e.preventDefault();
		if ( e.target.dataset.hasOwnProperty('index') ) {
			if ( this.props.onmodify ) {
				this.props.onmodify(parseInt(e.target.dataset.id));
			}

			this.setState({'value': parseInt(e.target.dataset.id)});
			this.doHide(e);
		}
	}

	componentWillReceiveProps(nextProps) {
			if (nextProps.expanded && !this.state.show) {
				this.setState({'show': true});
				setTimeout(this.doShow, 100);
			}
	}

	componentDidMount() {
			if (this.props.expanded && !this.state.show) {
				this.setState({'show': true});
				setTimeout(this.doShow, 100);
			}
	}

	render( props, state ) {
		const { show } = state;
		let value = props.value != null ? props.value : state.value;
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
								<SVGIcon>hamburger</SVGIcon>
								{Contents}
							</button>
						);
					}
				});
				if (SelectedField == null) {
					SelectedField = (
						<button type="button" onclick={this.onShow}>
							<SVGIcon>hamburger</SVGIcon>
							{props.items[0][1]}
						</button>
					);
				}
			}

			if ( show ) {
				ShowItems = [];

				let idx = 0;
				props.items.forEach(([dataId, Contents, Overlay]) => {
					if ( !props.hideSelectedField && dataId == value ) {

						SelectedField = (
							<button type="button" onclick={this.onShow}>
								{Contents}
							</button>
						);
					}

					if ( useClickCatcher && !Overlay ) {
						ClickCatcher = (
							<div
								class="-click-catcher"
								onclick={selfManaged ? this.onClickItem : ()=>{}}
								data-index={idx}
								data-id={dataId}
							/>
						);
					}
					else {
						ClickCatcher = null;
					}

					ShowItems.push(
						<div class="-item"
							onclick={selfManaged && !useClickCatcher ? this.onClickItem : ()=>{}}
							data-index={idx++}
							data-id={dataId}
						>
							{Contents}
							{Overlay}
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


			return (
				<div
					class={cN('input-dropdown', props.class)}
					ref={(input) => { this.dropdown = input; }}
				>
					{SelectedField}
					{ShowItems}
				</div>
			);
		}

		return <div />;
	}
}
