import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class ContentCommonBodyTitle extends Component {
	constructor( props ) {
		super(props);
	}

//	shouldComponentUpdate( nextProps ) {
//		return shallowDiff(this.props.children, nextProps.children);
//	}

	render( props ) {
		props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
		props.class.push("content-common-body");
		props.class.push("-title");
		props.class.push("_font2");
		if ( props.subtitle )
			props.class.push("-has-subtitle");
		
		var Prefix = null;
		if ( props.titleIcon ) {
			Prefix = <SVGIcon baseline small>{props.titleIcon}</SVGIcon>;
		}
		
		if (props.editing) {
			props.class.push('-editing');
			return (
				<div class={props.class}>
					<div class="-label">Title:</div>
					<input 
						type="text"
						value={props.title} 
						oninput={props.onmodify} 
						placeholder="Title" 
					/>
				</div>
			);
		}
		else {
			var Body = [];
			if ( props.title ) {
				if ( props.href )
					Body.push(<NavLink class="-text" href={props.href}>{Prefix}{props.title}</NavLink>);
				else
					Body.push(<div class="-text">{Prefix}{props.title}</div>);
			}
			
			if ( props.subtitle ) {
				Body.push(<span class="-subtext"> ({props.subtitle})</span>);
			}
			
			return <div class={props.class}>{Body}</div>;
		}
	}
}
