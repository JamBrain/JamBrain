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
		var _class = "content-common-body -title" + (props.class ? " "+props.class : "");
		
		if ( props.href )
			return <div class={_class}><NavLink class="_font2" href={props.href}>{props.children}</NavLink></div>;
		else
			return <div class={_class}><div class="_font2">{props.children}</div></div>;
	}
}
