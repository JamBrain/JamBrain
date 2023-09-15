import {Component} from 'preact';
import './common-footer-button.less';

import {UIIcon} from 'com/ui';

export default class ContentCommonFooterButtonMinMax extends Component {
	constructor( props ) {
		super(props);
	}

	render( {onClick} ) {
		if ( !onClick )
			onClick = function(){};

		return (
			<div class="content-common-footer-button -minmax" onClick={onClick}>
				<UIIcon class="_inline-if-not-minimized">arrow-up</UIIcon>
				<UIIcon class="_inline-if-minimized">arrow-down</UIIcon>
			</div>
		);
	}
}
