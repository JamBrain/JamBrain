import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavSpinner						from 'com/nav-spinner/spinner';

export default class SidebarTV extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			active: 0,
			streams: []
		};
		
		this.serviceIcons = [
			(<div />),						// Null //
			(<SVGIcon>twitch</SVGIcon>),	// Twitch //
			(<div></div>),
			(<div></div>),
			(<div></div>),
			(<div></div>),
			(<div></div>),
		];
	}
	
	componentDidMount() {
		fetch('//jammer.tv/v1/live.php/ludum-dare+game-jam+game-dev/', {method: 'POST' /*, mode:'no-cors'*/})
		.then(r => {
			if ( r )
				return r.json();
			//throw new Error("Response is empty");
		})
		.then(data => {
			this.setState({ 
				streams: this.state.streams.concat(data.streams)
			});
			return data;
		})
		.catch(err => {
			console.log("sidebar-tv:",err);
			this.setState({
				error: err
			});
			return err;
		});
	}
	
	setActive( id, e ) {
		this.setState({ active: id });
	}
	
	showOthers( others, active ) {
		var that = this;	// Workaround. Not sure if it's a Buble or Preact bug //
		
		return others.map( function(other,index) {
			if (other === active) {
				return (
					<div class="selected" onclick={that.setActive.bind(that,index)}>
						<div><img src={other.meta.thumbnail} /></div>
					</div>
				);
			}
			else {
				return (
					<div onclick={that.setActive.bind(that,index)}>
						<div><img src={other.meta.thumbnail} /></div>
					</div>
				);
			}
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
			
			return (
				<div class="sidebar-base sidebar-tv">
					<div class="-active" onclick={e => {console.log('tv'); window.location.hash = "#tv/"+active.meta.name;}}>
						<div class="-img"><img src={active.meta.thumbnail} /></div>
						<div class="-live"><SVGIcon baseline small>circle</SVGIcon> <span class="-text">LIVE</span></div>
						<div class="-name">{this.serviceIcons[active.service_id]} <span class="-text">{active.meta.name}</span></div>
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
