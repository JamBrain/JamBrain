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
				let NewState = {
					'items': [],
					'indexes': {}
				};

				if ( r.tag && r.tag.length ) {

					r.tag.forEach(item => {
						NewState.indexes[item.id] = NewState.items.length;
						NewState.items.push([item.id, item.name]);
					});
				}
					
				this.setState(NewState);
				
			});
	}

	render( props, state ) {
		let Class = ["content-common-body","-link"];

		const Limit = 64;
		const NamePlaceholder = props.namePlaceholder ? props.namePlaceholder : 'Name';
		const UrlPlaceholder = props.urlPlaceholder ? props.urlPlaceholder : 'Url';
		const HasItems = props.items && props.items.length > 0;

		if (props.editing && state.items) {
			Class.push('-editing');
			let TagDropDown = null;
			if (HasItems) {
				TagDropDown = (
					<InputDropdown class="-name"
						items={state.items}
						value={props.tag ? state.indexes[props.tag] : 0}
						onmodify={props.onModifyTag}
					/>);
			}
			
			return (
				<div class={cN(Class, props.class)}>
					{TagDropDown}
					<InputText class="-url"
						value={props.url}
						onmodify={props.onModifyUrl}
						placeholder={UrlPlaceholder}
						max={Limit}
					/>
				</div>

			);
		}
		else if ( state.items && props.url ) {
			const Index = props.tag ? state.indexes[props.tag] : 0;
			const Text = Sanitize.sanitize_URI(props.url);
			const Href = Text.indexOf('//') != -1 ? Text : '';

			const ShowLink = Href ? (<a href={Href} target="_blank">{Text}</a>) : <span>{Text}</span>;

			let ShowTag = null;
			if (HasItems)  {
				const Tag = state.items[Index];
				ShowTag = (<strong title={Tag[0]}>{Tag[1]}:</strong> );
			}
			
			return (
				<div class={cN(Class, props.class)}>
					{ShowTag}{ShowLink}
				</div>
			);
		}
		return <div />;
	}
}
