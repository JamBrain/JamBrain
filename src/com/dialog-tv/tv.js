import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

import DialogBase 						from 'com/dialog-base/base';

import Video							from '../../internal/video/video';


export default class DialogTV extends Component {
	constructor( props ) {
		super(props);
		
		this.state = this.calcSizes();
		this.state.showchat = false;
		
		this.onResize = this.onResize.bind(this);
		this.onChatClick = this.onChatClick.bind(this);

		// Hitbox: 288 wide minimum

		this.defaults = {
			'MinWidth': 480,
			'MinHeight': 270,
			'ChatWidth': 320,
			'BarHeight': 48
		};
	}

	shouldComponentUpdate( nextProps, nextState ) {
		// At the moment, there are no external events that should trigger an update (I ignore my props)
		return true;
	}

	componentDidMount() {
		window.addEventListener('resize', this.onResize);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
	}
	
	canShowChat() {
		var WindowWidth = window.innerWidth;
		var ViewWidth = Math.floor(WindowWidth - 32); /* ?? */

		return ViewWidth >= (this.defaults.MinWidth + this.defaults.ChatWidth); // 800		
	}
	
	calcSizes() {
		var ret = {};

		var WindowWidth = window.innerWidth;
		var WindowHeight = window.innerHeight - 64; /* Chop off 64 pixels from height to not hide the View Bar */
		ret.showchat = this.state.showchat;

		// Hitbox: 288 wide minimum

		var MinWidth = 480;
		var MinHeight = 270;
		var ChatWidth = 320;
		var BarHeight = 48;

		var ViewWidth = Math.floor(WindowWidth - 32);
		var ViewHeight = Math.floor(WindowHeight - 32);

		var CanHaveChat = ViewWidth >= (MinWidth + ChatWidth); // 800
		if ( !CanHaveChat ) {
			ret.showchat = false;
		}
		
		var Width = ViewWidth - (ret.showchat ? ChatWidth : 0);
		var Height = ViewHeight - BarHeight;

		// Minimum sizes //
		if ( Width < MinWidth ) Width = MinWidth;
		if ( Height < MinHeight ) Height = MinHeight;
		
		var AspectRatio = Width / Height;
		var TargetRatio = 16 / 9;
		
		if ( AspectRatio > TargetRatio ) {
			Width = Math.floor(Height * TargetRatio);
		}
		else {
			Height = Math.floor(Width / TargetRatio);
		}

		// Eliminate subpixel offsets by aligning //
		if ( (Width & 1) == 1 ) Width += 1;
		if ( (Height & 1) == 1 ) Height += 1;


//		jtv.style.width = (Width+(ShowChat?ChatWidth:0)) + "px";
//		jtv.style.height = (Height+BarHeight) + "px";

		ret.main = [
			Width + (ret.showchat ? ChatWidth : 0),
			(Height + BarHeight)
		];
		ret.bar = [
			Width,
			BarHeight
		];
		ret.chat = [
			ChatWidth,
			(Height + BarHeight)
		];
		ret.side = [
			ret.showchat ? ChatWidth : 0,
			(Height + BarHeight)
		];
		ret.video = [
			Width,
			Height
		];

//		side.style.width = ChatWidth + "px";
//		side.style.height = (Height+BarHeight) + "px";
//
//		chat.style.width = ChatWidth + "px";
//		chat.style.height = (Height+BarHeight) + "px";
//
//		stream.style.width = ChatWidth + "px";
//		stream.style.height = (Height+BarHeight) + "px";
//		
//		if ( ShowChat ) {
//			chat.style.visibility = "visible";
//		}
//		else {
//			chat.style.visibility = "hidden";
//		}

		return ret;
	}

	onResize( e ) {
		var sizes = this.calcSizes();
		//console.log(sizes);
		this.setState(sizes);
	}
	
	onChatClick( e ) {
		if ( this.canShowChat() ) {
			//console.log("chat: ",this.state.showchat);
			this.setState({'showchat': !this.state.showchat});
			this.onResize(e);
		}
	}
	
	render( props, state ) {
		var ShowStream = null;
		var ShowSide = null;

		if ( props.extra.length ) {
			ShowStream = Video.EmbedTwitch(
				"-tv",
				"//player.twitch.tv/?channel="+props.extra[0],
				state.video[0],
				state.video[1]
			);

			if ( state.showchat ) {
				ShowSide = Video.EmbedTwitch(
					"-chat",
					"//www.twitch.tv/"+props.extra[0]+"/chat?popout=",
					state.chat[0],
					state.chat[1]
				);
			}
			else {
				ShowSide = <div class="-chat" style={'width:'+state.chat[0]+'px; height:'+state.chat[1]+'px;'}></div>;
			}
		}
		
		var ShowBar = null;
		if ( true ) {
			var Left = null;
			if ( false ) {
				Left = (
					<div class="-left">
						<div class="">User</div>
						<div class="">Project Name</div>
						<div class="-button"><SVGIcon baseline>{props.following ? 'star-full' : 'star-empty'}</SVGIcon><div>Follow Project</div></div>
					</div>
				);
			};
			
			ShowBar = (
				<div class="-bar">
					<div class="-right">
						<div class={["-button",this.canShowChat() ? "" : "-disabled"]} onclick={this.onChatClick}>
							<SVGIcon baseline>{state.showchat ? 'bubble' : 'bubble-empty'}</SVGIcon>
							<div>Chat</div>
						</div>
					</div>
					{Left}
				</div>
			);
		}

		// TODO: Make DialogBase more simple (and move current DialogBase to DialogCommon)
		return (
			<DialogBase title="Jammer TV" class="dialog-tv" style={'width:'+state.main[0]+'px; height:'+state.main[1]+'px;'}>
				<div class="-branding">
					<img class="-logo" src={'//'+STATIC_DOMAIN+'/other/logo/jammer/JammerLogo56W.png'} />
					<span class="-text">TV</span>
				</div>
				<div class="-side" style={'width:'+state.side[0]+'px; height:'+state.side[1]+'px;'}>
					{ShowSide}
				</div>
				{ShowStream}
				{ShowBar}
			</DialogBase>
		);
	}
}
