import {h, Component}					from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';


export default class ViewFooter extends Component {
	constructor( props ) {
		super(props);
	}

	render( /*props, state*/ ) {
		return (
			<div id="footer">
				<div class="body">
				<div class="tm">
					<section class="logo">
						<SVGIcon class="ludum" baseline>ludum</SVGIcon><SVGIcon class="dare" baseline>dare</SVGIcon>
					</section>
					<section>Ludum Dare and LDJAM are trademarks of Interactive Snacks Limited</section>
				</div>
				<div>
					<h1>EXPLORE</h1>
					<section><a href="https://ludumdare.com">Ludum Dare</a></section>
					<section><a href="https://ldjam.com">LDJAM Event Home</a></section>
					<section><a href="https://ldjam.com/events/ludum-dare/rules">LDJAM Rules</a></section>
					<section><span>Schedule</span></section>
					<section><span>Learn</span></section>
				</div>
				<div>
					<h1>CONNECT</h1>
					<section><a href="https://ldjam.com/contact">Contact</a></section>
					<section><a href="https://newsletter.ldjam.com" target="_blank">Email Newsletter</a></section>
					<section><a /*href="https://ldjam.com/support"*/>Support Us!</a></section>
					<section class="icons">
					<a href="https://twitter.com/ludumdare" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
					<a href="https://github.com/ludumdare" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
					<a href="https://youtube.com/ludumdare" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
					<a href="https://twitch.tv/ludumdare" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitch</title><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg></a>
					</section>
				</div>
				<div class="legal">
					<section>Games are provided under their respective licenses. Except where otherwise noted, other content is provided under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution 4.0 International</a> license</section>
					<section>This website's source code <a href="https://github.com/ludumdare/ludumdare" target="_blank">is available</a> under an MIT open source license</section>
				</div>
				</div>
				<div class="copyright">
					<section class="policies"><a /*href="/privacy"*/>Privacy</a> | <a /*href="/terms"*/>Terms</a> | <a /*href="/cookies"*/>Cookies</a></section>
					<section>© {new Date().getFullYear()} <a href="https://interactivesnacks.com">Interactive Snacks Limited</a> 🍁</section>
				</div>
			</div>
		);
	}
}
