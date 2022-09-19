import {h, Component, toChildArray} 	from 'preact';
import {shallowDiff}	 				from 'shallow-compare/index';

export default class ContentBodyCommon extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(toChildArray(this.props.children), toChildArray(nextProps.children));
	}

	render( props ) {
		// '-body' for backwards compatibility (remove me)
		var _class = "content-body content-body-common -body" + (props.class ? " "+props.class : "");

		return <div class={_class}>{props.children}</div>;
	}
}
