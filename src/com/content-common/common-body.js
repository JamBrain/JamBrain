import { h, Component, toChildArray } from 'preact';
import { shallowDiff } from 'shallow-compare/index';

export default class ContentCommonBody extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(toChildArray(this.props.children), toChildArray(nextProps.children));
	}

	render( props ) {
		return <div class={cN("body", props.class)}>{props.children}</div>;
	}
}
