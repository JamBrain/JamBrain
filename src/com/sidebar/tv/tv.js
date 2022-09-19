import {h, Component} from 'preact';
import cN from 'classnames';

import ShallowCompare	 				from 'shallow-compare/index';

import $JammerTV						from 'external/jammertv/jammertv';

import UIIcon 							from 'com/ui/icon';
import NavSpinner						from 'com/nav-spinner/spinner';
import UIImage	 						from 'com/ui/image';

import ButtonBase						from 'com/button-base/base';
import ButtonLink						from 'com/button-link/link';


const RequiredStreams = 5;

export default class SidebarTV extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			active: 0,
			streams: []
		};

		this.services = [
			'null',
			'twitch',
			'youtube',
		];

		this.serviceIcons = [
			(<div />),						// Null //
			(<UIIcon>twitch</UIIcon>),	// Twitch //
			(<UIIcon>youtube</UIIcon>),	// YouTube //
			(<div></div>),
			(<div></div>),
			(<div></div>),
			(<div></div>),
		];

		this.FailImage = '//'+STATIC_DOMAIN+'/other/asset/TVFail.png';

		this.refreshStreams = this.refreshStreams.bind(this);
	}

	loadStreams() {
		var NewStreams = [];

		// Fetch Ludum Dare streams first
		return $JammerTV.GetLive([
			'ludum-dare',
			/*'ludum-dare-art',
			'ludum-dare-music',
			'ludum-dare-craft',
			'ludum-dare-play',
			'ludum-dare-talk'*/
		])
		// Fetch Game Jam streams next (if we don't have enough)
		.then(data => {
			// Parse Data
			if ( data && Array.isArray(data.streams) ) {
				NewStreams = NewStreams.concat(data.streams);
			}

			// Fetch more (if needed)
			if ( NewStreams.length < RequiredStreams ) {
				return $JammerTV.GetLive([
					'game-jam',
					/*'game-jam-art',
					'game-jam-music',
					'demoscene',*/
				]);
			}
			return null;
		})
		// Fetch Game Dev streams last (if we didn't have enough)
		.then(data => {
			// Parse data
			if ( data && Array.isArray(data.streams) ) {
				NewStreams = NewStreams.concat(data.streams);
			}

			// Fetch more (if needed)
			if ( NewStreams.length < RequiredStreams ) {
				return $JammerTV.GetLive([
					'game-dev',
				]);
			}
			return null;
		})
		// Wrap up
		.then(data => {
			// Parse Data
			if ( data && Array.isArray(data.streams) ) {
				NewStreams = NewStreams.concat(data.streams);
			}

			// Populate state with streams
			this.setState({
				'streams': NewStreams
			});
			return null;
		})
		.catch(err => {
			// Error state
			this.setState({
				'error': err
			});
			return err;
		});
	}

	// Called every few minutes, to make sure stream list is fresh
	refreshStreams() {
		// TODO: Raise this, once JammerTV caching is correctly supported
		var StreamRefreshRate = 3*60*1000;
		var HiddenRefreshRate = 1*20*1000;	// When hidden, refresh more often (which fails, so work is minimal)

		// But only if the window is visible
		if ( !document.hidden ) {
			//console.log("Streams Refreshed: "+Date.now());

			this.loadStreams().then(() => {
				//console.log("Queued");

				this.timer = setTimeout(() => {
					this.refreshStreams();
				}, StreamRefreshRate);
			});
		}
		else {
			//console.log("Hidden Queue");

			this.timer = setTimeout(() => {
				this.refreshStreams();
			}, HiddenRefreshRate);
		}
	}

//	shouldComponentUpdate( nextProps, nextState ) {
//		var com = ShallowCompare(this, nextProps, nextState);
//		console.log("SideBarTV",com,this.state, nextState);
//		return com;
//	}

	componentDidMount() {
//		console.log("SideBarTV: componentDidMount");
		this.refreshStreams();
	}

	componentWillUnmount() {
//		console.log("SideBarTV: componentWillUnmount");
	}

	setActive( id, e ) {
		this.setState({ active: id });
	}

	showOthers( others, active ) {
		return others.map((other, index) => {
			return (
				<div class={cN(other === active ? "selected" : "")} onClick={this.setActive.bind(this, index)} title={other && other.user_name ? other.user_name : ""}>
					<div><UIImage src={ other ? other.thumbnail_180p : ""} failsrc={this.FailImage} /></div>
				</div>
			);
		});
	}

	render( props, state ) {
		if ( state.error ) {
			return (
				<div class="sidebar-base sidebar-tv">
					<div class="-detail">
						{""+state.error}
					</div>
				</div>
			);
		}
		else if ( state.streams.length == 0 ) {
			return (
				<div class="sidebar-base sidebar-tv">
					<NavSpinner />
				</div>
			);
		}
		else {
			let active = state.streams[state.active];
			let others = [
				state.streams[0],
				state.streams[1],
				state.streams[2],
			];

					// This is the above stuff (LIVE vs VOD). disabled for now
//					<div class="-view">
//						<ButtonBase class="-live selected"><UIIcon baseline small>video-camera</UIIcon> <span>LIVE</span></ButtonBase>
//						<ButtonBase class="-vod "><UIIcon baseline small>video</UIIcon> <span>VIDEO</span></ButtonBase>
//					</div>

			return (
				<div class="sidebar-base sidebar-tv">
					<div class="-active" onClick={e => {
							console.log('tv');
							/*window.open("https://www.twitch.tv/directory/game/Creative/ldjam", '_blank');*/
							window.location.hash = "#tv/"+this.services[active.service_id]+'/'+active.user_slug;
						}}>
						<div class="-img"><UIImage src={active.thumbnail_180p} failsrc={this.FailImage} /></div>
						<div class="-live"><UIIcon baseline small>circle</UIIcon> <span class="-text">LIVE</span></div>
						<div class={'-name stream-'+this.services[active.service_id]}>{this.serviceIcons[active.service_id]} <span class="-text">{active.user_name}</span></div>
						<div class="-viewers"><UIIcon baseline>tv</UIIcon> <span class="-text">{active.viewers}</span></div>
						<div class="-external" onClick={e => {
							e.stopPropagation();
							if ( this.services[active.service_id] == "twitch" ) {
									window.open("https://www.twitch.tv/"+active.user_slug, "_blank");
							} else if ( this.services[active.service_id] == "youtube" ) {
									//TODO: add youtube action, when youtube displays in TV
							}
						}}><UIIcon>twitch</UIIcon></div>
						<div class="-play"><UIIcon>play</UIIcon></div>
					</div>
					<div class="-detail" title={active.title}>
						<UIIcon top>quotes-left</UIIcon>
						<UIIcon bottom>quotes-right</UIIcon>
						<div>{active.title}</div>
					</div>
					<div class="-browse">
						{this.showOthers(others,active)}
						<ButtonLink class="-more" href="https://www.twitch.tv/directory/all/tags/c8d6d6ee-3b02-4ae7-81e9-4c0f434941cc" title="MORE">
							<div><UIIcon>circle</UIIcon> <UIIcon>circle</UIIcon> <UIIcon>circle</UIIcon></div>
						</ButtonLink>
					</div>
				</div>
			);
		}
	}
}
