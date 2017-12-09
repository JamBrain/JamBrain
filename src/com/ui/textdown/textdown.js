import {h, Component}					from 'preact/preact';
import UIButton							from 'com/ui/button/button';
import UIText							from 'com/ui/text/text';

export default class UITextdown extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': false,

			// Cache. Not necessary but saves us from redoing work
			'items': null,
			'query': null,
		};

		this.doShow = this.doShow.bind(this);
		this.doHide = this.doHide.bind(this);

		this.onModify = this.onModify.bind(this);
		this.onSelect = this.onSelect.bind(this);
	}

	componentDidMount() {
		this.updateFilter();
	}
	componentWillReceiveProps( nextProps, nextState ) {
		this.updateFilter(this.getQuery(nextProps.value));
	}

	/// Expects str to be trimmed and lower case
	filterItems( str ) {
		return this.props.items.filter(word => word && word.name && word.name.indexOf && (word.name.toLowerCase().indexOf(str) > -1));
	}
	getQuery( value = this.props.value ) {
		if ( value && value.length )
			return value.trim().toLowerCase();
		return '';
	}
	updateFilter( Query = this.getQuery() ) {
		this.setState({
			'items': this.filterItems(Query),
			'query': Query,
		});
	}

	doShow( e ) {
		//console.log('show');
		this.setState({'show': true});
	}
	doHide( e ) {
		//console.log('hide');
		this.setState({'show': false});
	}

	onModify( e ) {
		if ( this.props.onmodify ) {
			this.props.onmodify(e);
		}
	}
	onSelect( e ) {
		if ( this.props.onselect && this.state.query ) {
			let item = (this.state.items && this.state.items.length) ? this.state.items[0] : null;
			this.props.onselect(item);
		}
	}

	onClickItem( item ) {
		if ( this.props.onselect ) {
			this.props.onselect(item);
		}
	}

	renderItem( item, index ) {
		if ( item && item.name ) {
			return (
				<UIButton class="-item" title={item.id+' - '+item.slug} onclick={this.onClickItem.bind(this, item)}>
					{item.name}
				</UIButton>
			);
		}

	}
	renderItems( items ) {
		let Out = [];

		for ( let idx = 0; idx < items.length; idx++ ) {
			Out.push(this.renderItem(items[idx], idx));
		}

		return <div class="-items">{Out}</div>;
	}

	render( props, state ) {
		let Classes = cN(
			'ui-textdown',
			props.class,
			props.left ? '-left' : null,
			props.right ? '-right' : null
		);

		let ShowItems = null;
		if ( state.items && state.query && state.show ) {
			if ( state.items.length )
				ShowItems = this.renderItems(state.items);
			else
				ShowItems = <div class="-items" tabindex="-1"><div class="-item -fail">No match found</div></div>;
		}

		// NOTE: a tabindex is required to us focusin and focusout
		return (
			<div class={Classes} tabindex="-1" onfocusin={this.doShow} onfocusout={this.doHide} ref={(input) => { this.ref = input; }}>
				<UIText class="-text" value={props.value} placeholder={props.placeholder} onmodify={this.onModify} onselect={this.onSelect} maxlength={props.maxlength} showlength={false} />
				{ShowItems}
			</div>
		);
	}
}
