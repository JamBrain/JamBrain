import {Component, toChildArray} from 'preact';
import './common-body.less';
import './common-footer.less';
import './common-header.less';

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
