import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';

export default class ContentCommonBodyTitle extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props.children, nextProps.children);
	}

	render( props ) {
		props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
		props.class.push("content-common-body");
		props.class.push("-title");
		props.class.push("_font2");
		if ( props.subtitle )
			props.class.push("-has-subtitle");
		
		
		var Body = [];
		if ( props.title ) {
			if ( props.href )
				Body.push(<NavLink class="-text" href={props.href}>{props.title}</NavLink>);
			else
				Body.push(<div class="-text">{props.title}</div>);
		}
		
		if ( props.subtitle ) {
			Body.push(<span class="-subtext"> ({props.subtitle})</span>);
		}
		
		return <div class={props.class}>{Body}</div>;
	}
}
