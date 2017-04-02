import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

export default class ContentCommonBody extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props.children, nextProps.children);
	}

	render( props ) {
		var _class = "content-common-body" + (props.class ? " "+props.class : "");

		return <div class={_class}>{props.children}</div>;
	}
}
