import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

export default class ContentCommonFooterButtonMinMax extends Component {
	constructor( props ) {
		super(props);
	}

	render( {onClick} ) {
		if ( !onClick )
			onClick = function(){};

		return (
			<div class="content-common-footer-button -minmax" onClick={onClick}>
				<SVGIcon class="-inline-if-not-minimized">arrow-up</SVGIcon>
				<SVGIcon class="-inline-if-minimized">arrow-down</SVGIcon>
			</div>
		);
	}
}
