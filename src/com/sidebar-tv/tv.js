import { h, Component } from 'preact/preact';
import CoreButton		from 'com/core-button/button';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarTV extends Component {
	constructor() {
	}
	
	render( props, state ) {
		return (
			<div class="sidebar-tv">
				<div class="-active">
					<div class="-img"><img src="https://static-cdn.jtvnw.net/previews-ttv/live_user_esl_sc2-320x180.jpg" /></div>
					<div class="-live"><SVGIcon>circle</SVGIcon> <span>LIVE</span></div>
					<div class="-play"><SVGIcon>play</SVGIcon></div>
				</div>
				<div class="-detail"><SVGIcon>twitch</SVGIcon> Doing Stuff! #GameDev</div>
				<div class="-browse">
					<div class="selected"><div><img src="https://static-cdn.jtvnw.net/previews-ttv/live_user_esl_sc2-320x180.jpg" /></div></div>
					<div><div><img src="https://static-cdn.jtvnw.net/previews-ttv/live_user_esl_dota2-320x180.jpg" /></div></div>
					<div><div><img src="https://static-cdn.jtvnw.net/previews-ttv/live_user_esl_csgo-320x180.jpg" /></div></div>
				</div>
			</div>
		);
	}
}
