import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';
import Sanitize							from '../../internal/sanitize/sanitize';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

import InputText						from 'com/input-text/text';
import InputDropdown					from 'com/input-dropdown/dropdown';

import $Tag								from '../../shrub/js/tag/tag';


export default class ContentCommonBodyField extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {};
	}

	componentDidMount() {
		$Tag.Get(this.props.filter)
			.then(r => {
				if ( r.tag && r.tag.length ) {
					let that = this;

					let NewState = {
						'items': [],
						'indexes': {}
					};
					r.tag.forEach(item => {
						NewState.indexes[item.id] = NewState.items.length;
						NewState.items.push([item.id, item.name]);
					});
					
					this.setState(NewState);
				}
			});
	}

	render( props, state ) {
		var Class = ["content-common-body","-link"];

		var Limit = 64;
		var NamePlaceholder = props.namePlaceholder ? props.namePlaceholder : 'Name';
		var UrlPlaceholder = props.urlPlaceholder ? props.urlPlaceholder : 'Url';
		
		if (props.editing && state.items) {
			Class.push('-editing');
			return (
				<div class={cN(Class, props.class)}>
					<InputDropdown class="-name"
						items={state.items}
						value={state.indexes[props.tag ? props.tag : state.indexes[0]]}
						onmodify={props.onModifyTag}
					/>
					<InputText class="-url"
						value={props.url} 
						onmodify={props.onModifyUrl}
						placeholder={UrlPlaceholder}
						max={Limit}
					/>
				</div>

//					<InputText class="-name"
//						value={props.name} 
//						onmodify={props.onModifyName}
//						placeholder={NamePlaceholder}
//						max={Limit}
//					/>
			);
		}
		else if ( state.items && props.tag ) {
			var Index = state.indexes[props.tag];
			var Tag = state.items[Index];
			var Text = Sanitize.sanitize_URI(props.url);
			var Href = Text.indexOf('//') != -1 ? Text : '';

			var ShowLink = Href ? (<a href={Href} target="_blank">{Text}</a>) : <span>{Text}</span>;

			return (
				<div class={cN(Class, props.class)}>
					<strong title={Tag[0]}>{Tag[1]}:</strong> {ShowLink}
				</div>
			);
		}
		return <div />;
	}
}
