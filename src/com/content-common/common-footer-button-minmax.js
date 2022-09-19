import { h, Component } 				from 'preact/preact';
import UIIcon 							from 'com/ui/icon';

export default class ContentCommonFooterButtonMinMax extends Component {
	constructor( props ) {
		super(props);
	}

	render( {onClick} ) {
		if ( !onClick )
			onClick = function(){};

		return (
			<div class="content-common-footer-button -minmax" onClick={onClick}>
				<UIIcon class="-inline-if-not-minimized">arrow-up</UIIcon>
				<UIIcon class="-inline-if-minimized">arrow-down</UIIcon>
			</div>
		);
	}
}
