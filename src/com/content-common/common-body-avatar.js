import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import IMG2								from 'com/img2/img2';

export default class ContentCommonBodyAvatar extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props.children, nextProps.children);
	}

	render( props ) {
		var _class = "content-common-body -avatar" + (props.class ? " "+props.class : "");
		
		return <div class={_class}><IMG2 src={props.src} failsrc="///other/dummy/user64.png" /></div>;
	}
}
