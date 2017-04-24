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
		var Class = ["content-common-body","-field"];

//		var Prefix = null;
//		if ( props.titleIcon ) {
//			Prefix = <SVGIcon baseline small>{props.titleIcon}</SVGIcon>;
//		}

		var Limit = 64;
		var Placeholder = props.placeholder ? props.placeholder : 'Field';
		
		if (props.editing) {
			Class.push('-editing');
			return (
				<div class={cN(Class, props.class)}>
					<div class="-label">{props.label ? props.label : ""}</div>
					<InputText 
						value={props.title} 
						onmodify={props.onmodify}
						placeholder={Placeholder}
						maxlength={Limit}
					/>
				</div>
			);
		}
		else {
			var Title = props.title.trim().length ? props.title.trim() : Placeholder;
			var Body = [];
			if ( props.href )
				Body.push(<NavLink class="-text" href={props.href}>{Prefix}{Title}</NavLink>);
			else
				Body.push(<div class="-text">{Prefix}{Title}</div>);
			
			if ( props.subtitle ) {
				Body.push(<span class="-subtext"> ({props.subtitle})</span>);
			}
			
			return <div class={cN(Class, props.class)}>{Body}</div>;
		}
	}
}
