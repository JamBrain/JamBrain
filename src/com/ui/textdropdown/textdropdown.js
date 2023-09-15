import { Component } from 'preact';
import './textdropdown.module.less';

import {Button} from '../button';
import {TextField} from '../textfield';

export class TextDropdown extends Component {
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
		if ( this.props.onModify ) {
			this.props.onModify(e);
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
				<Button class="-item" title={item.id+' - '+item.slug} onClick={this.onClickItem.bind(this, item)}>
					{item.name}
				</Button>
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
		let Classes = [
			'ui-textdown',
			props.class,
			props.left ? '-left' : '',
			props.right ? '-right' : ''
		].join(' ');

		let ShowItems = null;
		if ( state.items && state.query && state.show ) {
			if ( state.items.length )
				ShowItems = this.renderItems(state.items);
			else
				ShowItems = <div class="-items" tabIndex={-1}><div class="-item -fail">No match found</div></div>;
		}

		// NOTE: a tabindex is required to use focus and blur
		return (
			<div class={Classes} tabIndex={-1} onFocus={this.doShow} onBlur={this.doHide}>
				<TextField class="-text" value={props.value} placeholder={props.placeholder} onModify={this.onModify} onselect={this.onSelect} maxLength={props.maxLength} showLength={false} />
				{ShowItems}
			</div>
		);
	}
}
