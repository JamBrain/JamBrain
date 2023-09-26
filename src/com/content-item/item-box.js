import { Component } from 'preact';
import './item-box.less';
import './item-boxes.less';

import ContentBox from 'com/content-box/box';

export default class ContentItemBox extends Component {
	constructor( props ) {
		super(props);
	}

	render( props, state ) {
		props = Object.assign({}, props);

		return <ContentBox {...props} />;
	}
}
