import { h, Component } 				from 'preact/preact';
import ShallowCompare	 				from 'shallow-compare/index';

import $JammerTV						from 'external/jammertv/jammertv';

import SVGIcon 							from 'com/svg-icon/icon';
import NavSpinner						from 'com/nav-spinner/spinner';
import IMG	 							from 'com/img2/img2';

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
			(<SVGIcon>twitch</SVGIcon>),	// Twitch //
			(<SVGIcon>youtube</SVGIcon>),	// YouTube //
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
			'ludum-dare-art',
			'ludum-dare-music',
			'ludum-dare-craft',
			'ludum-dare-play',
			'ludum-dare-talk'
		])
		// Fetch Game Jam streams next (if we don't have enough)
		.then(data => {
			// Parse Data
			if ( data && Array.isArray(data.streams) ) {
				NewStreams = NewStreams.concat(data.streams);
			}
			
			// hack
			//this.state.streams = this.state.streams.concat(data.streams);
			
			// Fetch more (if needed)
			if ( NewStreams.length < 3 ) {
			
//			if ( this.state.streams.length < 3 ) {
				return $JammerTV.GetLive([
					'game-jam',
					'game-jam-art',
					'game-jam-music',
				]);
			}
		})
		// Fetch Game Dev streams last (if we didn't have enough)
		.then(data => {
			// Parse data
			if ( data && Array.isArray(data.streams) ) {
				NewStreams = NewStreams.concat(data.streams);
			}

			// Fetch more (if needed)
			if ( NewStreams.length < 3 ) {
				return $JammerTV.GetLive([
					'game-dev',
					'game-art',
					'game-music'
				]);
			}
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
		})
				
//				.then(data2 => {
//					this.setState({ 
//						'streams': this.state.streams.concat(data2.streams)
//					});
//				})
//				.catch(err => {
//					console.log("sidebar-tv2:",err);
//					this.setState({
//						'error': err
//					});
//					return err;
//				});
//			}
//			else {
//				this.setState({ 
//					'streams': this.state.streams
//				});
//			}
//			
//			return data;
//		})
		.catch(err => {
			console.log("sidebar-tv:",err);
			this.setState({
				error: err
			});
			return err;
		});		
	}
	
	// Called every few minutes, to make sure stream list is fresh
	refreshStreams() {
//		// But only if the window is visible
//		if ( !document.hidden ) {
//			console.log("Streams Refreshed: "+Date.now());
//			this.loadStreams().then(function() {
//				console.log("Queued");
//				this.timer = setTimeout(function() {
//					refreshStreams();
//				}, 2*60*1000);
//			}
//		}
//		else {
//			console.log("Hidden Queue");
//			this.timer = setTimeout(function() {
//				refreshStreams();
//			}, 2*60*1000);
//		}
	}

//	shouldComponentUpdate( nextProps, nextState ) {
//		var com = ShallowCompare(this, nextProps, nextState);
//		console.log("SideBarTV",com,this.state, nextState);
//		return com;
//	}
		
	componentDidMount() {
//		console.log("SideBarTV: componentDidMount");
		this.loadStreams();
	}

	componentWillUnmount() {
//		console.log("SideBarTV: componentWillUnmount");
	}
	
	setActive( id, e ) {
		this.setState({ active: id });
	}
	
	showOthers( others, active ) {
		return others.map( function(other, index) {
			if (other === active) {
				return (
					<div class="selected" onclick={this.setActive.bind(this, index)}>
						<div><IMG src={ other && other.meta ? other.meta.thumbnail : ""} failsrc={this.FailImage} /></div>
					</div>
				);
			}
			else {
				return (
					<div onclick={this.setActive.bind(this, index)}>
						<div><IMG src={ other && other.meta ? other.meta.thumbnail : ""} failsrc={this.FailImage} /></div>
					</div>
				);
			}
		}.bind(this));
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
			
			return (
				<div class="sidebar-base sidebar-tv">
					<div class="-active" onclick={e => {
							console.log('tv'); 
							/*window.open("https://www.twitch.tv/directory/game/Creative/ldjam", '_blank');*/
							window.location.hash = "#tv/"+this.services[active.service_id]+'/'+active.meta.name;
						}}>
						<div class="-img"><IMG src={active.meta.thumbnail} failsrc={this.FailImage} /></div>
						<div class="-live"><SVGIcon baseline small>circle</SVGIcon> <span class="-text">LIVE</span></div>
						<div class={'-name stream-'+this.services[active.service_id]}>{this.serviceIcons[active.service_id]} <span class="-text">{active.meta.name}</span></div>
						<div class="-viewers"><SVGIcon baseline>tv</SVGIcon> <span class="-text">{active.viewers}</span></div>
						<div class="-play"><SVGIcon>play</SVGIcon></div>
					</div>
					<div class="-detail" title={active.meta.status}>
						<SVGIcon top>quotes-left</SVGIcon>
						<SVGIcon bottom>quotes-right</SVGIcon>
						<div>{active.meta.status}</div>
					</div>
					<div class="-browse">
						{this.showOthers(others,active)}
					</div>
				</div>
			);
		}
	}
}
