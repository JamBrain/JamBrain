import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

import InputText						from 'com/input-text/text';

export default class ContentCommonBodyField extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var Class = ["content-common-body","-link"];

		var Limit = 64;
		var NamePlaceholder = props.namePlaceholder ? props.namePlaceholder : 'Name';
		var UrlPlaceholder = props.urlPlaceholder ? props.urlPlaceholder : 'Url';
		
		if (props.editing) {
			Class.push('-editing');
			return (
				<div class={cN(Class, props.class)}>
					<InputText class="-name"
						value={props.name} 
						onmodify={props.onModifyName}
						placeholder={NamePlaceholder}
						max={Limit}
					/>
					<InputText class="-url"
						value={props.url} 
						onmodify={props.onModifyUrl}
						placeholder={UrlPlaceholder}
						max={Limit}
					/>
				</div>
			);
		}
		else {
			return (
				<div class={cN(Class, props.class)}>
					{props.name}
					{props.url}
				</div>
			);
		}
	}
}
