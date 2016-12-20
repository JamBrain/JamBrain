import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

import DialogBase 						from 'com/dialog-base/base';

import Video							from '../../internal/video/video';


export default class DialogTV extends Component {
	constructor( props ) {
		super(props);
		
		this.state = this.calcSizes();
		
		this.onResize = this.onResize.bind(this);
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
	
	calcSizes() {
		var WindowWidth = window.innerWidth;
		var WindowHeight = window.innerHeight;
		var ShowChat = false;//jtv_showbar;

		// Hitbox: 288 wide minimum

		var MinWidth = 480;
		var MinHeight = 270;
		var ChatWidth = 320;
		var BarHeight = 48;

		var ViewWidth = Math.floor(WindowWidth - 64);
		var ViewHeight = Math.floor(WindowHeight - 64);

		var CanHaveChat = ViewWidth >= (MinWidth + ChatWidth); // 800
		if ( !CanHaveChat ) {
			ShowChat = false;
		}

		var Width = ViewWidth - (ShowChat ? ChatWidth : 0);
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

		// 
		var ret = {};

//		jtv.style.width = (Width+(ShowChat?ChatWidth:0)) + "px";
//		jtv.style.height = (Height+BarHeight) + "px";

		ret.main = [
			Width,
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
	
	render( props ) {
		var ShowStream = null;
		if ( props.extra.length ) {
			ShowStream = Video.EmbedTwitch(
				"-tv",
				"//player.twitch.tv/?channel="+props.extra[0],
				this.state.video[0],
				this.state.video[1]
			);
		}

		// TODO: Make DialogBase more simple (and move current DialogBase to DialogCommon)
		return (
			<DialogBase title="Jammer TV" class="dialog-tv">
				<div class="-branding">
					<img class="-logo" src={'//'+STATIC_DOMAIN+'/other/logo/jammer/JammerLogo56W.png'} />
					<span class="-text">TV</span>
				</div>
				{ShowStream}
			</DialogBase>
		);
	}
}
