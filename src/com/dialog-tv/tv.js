import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

import DialogBase 						from 'com/dialog-base/base';

import Video							from '../../internal/video/video';


export default class DialogTV extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps, nextState ) {
		// At the moment, there are no external events that should trigger an update (I ignore my props)
		return false;
	}
	
	render( props ) {
		var ShowStream = null;
		if ( props.extra.length ) {
			ShowStream = Video.EmbedTwitch("-tv", "//player.twitch.tv/?channel="+props.extra[0]);
		}

		// TODO: Make DialogBase more simple (and move current DialogBase to DialogCommon)
		return (
			<DialogBase title="Jammer TV" class="dialog-tv">
				<img class="-logo" src={'//'+STATIC_DOMAIN+'/other/logo/jammer/JammerLogo56W.png'} />
				{ShowStream}
			</DialogBase>
		);
	}
}
