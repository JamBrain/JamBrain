import {Component} from 'preact';
import UIIcon from 'com/ui/icon';
import './youtube.less';

export default class YoutubeEmbed extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'iframe': false
		};

		this.onClick = this.onClick.bind(this);
	}

	onClick( e ) {
		this.setState({'iframe': true});
	}

	render( props, state ) {
		var yt_thumbnail_prefix = "https://i.ytimg.com/vi/";
		var yt_thumbnail_suffix = "/mqdefault.jpg";

		var video_id = props.id;

		var args = ['autoplay=1'];
		// MK: Is this a bug or is this code unused?
		if ( url.args.t ) {
			args.push('start=' + Number(url.args.t));
		}

		if ( state.iframe ) {
			return (
				<div class="embed-video -youtube">
					<div class="-video">
						<iframe src={'https://www.youtube.com/embed/' + video_id + '?' + args.join('&')} frameBorder="0" allowFullScreen allow="autoplay; fullscreen"></iframe>
					</div>
				</div>
			);
		}

		return (
			<div class="embed-video -youtube">
				<div class="-thumbnail">
					<div class="-overlay" onClick={this.onClick} >
						<div class="-play">
							<UIIcon middle>play</UIIcon>
						</div>
						<div class="-external">
							<a title="Open in new tab" href={"//www.youtube.com/watch?v="+video_id} target="_blank" rel="noopener" onClick={(e) => {
								e.stopPropagation();
							}}>
								<UIIcon middle block>youtube</UIIcon>
							</a>
						</div>
					</div>
					<img alt="Youtube video thumbnail" src={yt_thumbnail_prefix + video_id + yt_thumbnail_suffix}/>
				</div>
			</div>
		);
	}
}
