import {Component} from 'preact';
import {Icon, Button, Tooltip} from 'com/ui';
import './youtube.less';

// MK TODO: Can this be stateless? i.e. "on click", replace the element entirely

export default class YoutubeEmbed extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': false
		};

		this.onClick = this.onClick.bind(this);
	}

	onClick( e ) {
		this.setState({'show': true});
	}

	render( props, state ) {
		const {'id': video_id, time, ...otherProps} = props;
		let args = new URLSearchParams('autoplay=1');

		if ( time ) {
			args.append('start', time);
		}

		if ( state.show ) {
			return (
				<div class="embed-video youtube">
					<div class="-video">
						<iframe src={`https://www.youtube.com/embed/${video_id}?${args}`} frameBorder="0" allowFullScreen allow="autoplay; fullscreen" />
					</div>
				</div>
			);
		}

		return (
			<div class="embed-video youtube">
				<div class="-thumbnail">
					<div class="-overlay" onClick={this.onClick} >
						<div class="-play">
							<Icon class="-middle" src="play" />
						</div>
						<div class="-external">
							<Tooltip text="Open in new tab">
								<Button href={`https://www.youtube.com/watch?v=${video_id}`}>
									<Icon class="-middle -block" src="youtube" />
								</Button>
							</Tooltip>
						</div>
					</div>
					<img alt="Youtube video thumbnail" src={`https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`}/>
				</div>
			</div>
		);
	}
}
