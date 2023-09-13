import {Component, toChildArray} from 'preact';
import {Diff} from 'shallow';

export default class ContentCommonBody extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return Diff(toChildArray(this.props.children), toChildArray(nextProps.children));
	}

	render( props ) {
		return <div class={`body ${props.class ?? ''}`}>{props.children}</div>;
	}
}
