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
				<div class="tm col">
					<section class="logo">
						<SVGIcon class="ludum" baseline>ludum</SVGIcon><SVGIcon class="dare" baseline>dare</SVGIcon>
					</section>
					{/*<section>Ludum Dare and LDJAM are trademarks of Interactive Snacks Limited</section>*/}
				</div>
				<div class="nav col">
					<div class="explore">
						<h1>EXPLORE</h1>
						<section><a href="https://ludumdare.com">Ludum Dare</a></section>
						<section><a href="https://ldjam.com">LDJAM Event Home</a></section>
						<section><a href="https://ldjam.com/events/ludum-dare/rules">LDJAM Rules</a></section>
						<section><span>Schedule</span></section>
						<section><span>Learn</span></section>
					</div>
					<div class="connect">
						<h1>CONNECT</h1>
						<section><a href="https://ldjam.com/contact">Contact</a></section>
						<section><a href="https://ldjam.com/support">Support Us!</a></section>
						{/*<section><a href="https://newsletter.ldjam.com" target="_blank">Email Newsletter</a></section>*/}
						<section class="icons">
							{/*<a href="https://twitter.com/ludumdare" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>*/}
							<a href="https://bsky.app/profile/ludumdare.com" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Bluesky</title><path d="M6.936 3.809c3.67 2.754 7.615 8.339 9.064 11.336 1.449-2.997 5.395-8.582 9.064-11.336C27.71 1.822 32 .284 32 5.177c0 .977-.56 8.209-.889 9.383-1.142 4.082-5.304 5.123-9.007 4.493 6.472 1.101 8.118 4.75 4.563 8.398-6.753 6.93-9.705-1.738-10.462-3.96-.14-.407-.204-.597-.205-.435-.001-.162-.066.028-.205.436-.756 2.22-3.709 10.888-10.462 3.96-3.555-3.65-1.91-7.298 4.563-8.4-3.703.63-7.865-.41-9.007-4.492C.56 13.386 0 6.154 0 5.177 0 .284 4.29 1.822 6.936 3.809Z"/></svg></a>
							<a href="https://bsky.brid.gy/ludumdare.com" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Mastodon</title><path d="M56.526 0C42.03.119 28.086 1.688 19.96 5.42c0 0-16.116 7.21-16.116 31.806 0 5.632-.11 12.367.069 19.509.585 24.054 4.41 47.76 26.65 53.647 10.254 2.715 19.058 3.283 26.149 2.893 12.859-.712 20.077-4.588 20.077-4.588l-.424-9.33s-9.19 2.897-19.509 2.544c-10.224-.35-21.018-1.102-22.672-13.656a25.746 25.746 0 0 1-.23-3.52s10.038 2.453 22.758 3.036c7.778.357 15.071-.455 22.48-1.34 14.206-1.696 26.577-10.45 28.131-18.448 2.45-12.6 2.248-30.747 2.248-30.747 0-24.597-16.115-31.806-16.115-31.806C85.33 1.688 71.378.12 56.882 0ZM40.12 19.219c6.038 0 10.61 2.32 13.634 6.963l2.94 4.927 2.939-4.927c3.022-4.642 7.594-6.963 13.633-6.963 5.218 0 9.423 1.834 12.634 5.413 3.112 3.578 4.662 8.416 4.662 14.503v29.782h-11.8V40.01c0-6.094-2.564-9.187-7.692-9.187-5.67 0-8.512 3.669-8.512 10.924V57.57h-11.73V41.747c0-7.255-2.842-10.924-8.512-10.924-5.129 0-7.693 3.093-7.693 9.187v28.907h-11.8V39.135c0-6.087 1.55-10.925 4.664-14.503 3.21-3.579 7.415-5.413 12.633-5.413z"/></svg></a>
							<a href="https://github.com/ludumdare" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
							<a href="https://youtube.com/ludumdare" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
							<a href="https://twitch.tv/ludumdare" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitch</title><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg></a>
						</section>
					</div>
				</div>
				<div class="legal col">
					<section>Games are provided under their respective licenses. Except where otherwise noted, other content is provided under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution 4.0 International</a> license</section>
					<section>This website's source code <a href="https://github.com/ludumdare/ludumdare" target="_blank">is available</a> under an MIT open source license</section>
				</div>
				</div>
				<div class="copyright">
					<section class="policies"><a href="/privacy">Privacy</a> | <a href="/cookie">🍪</a> | <a href="/terms">Terms</a></section>
					{/*<section>© {new Date().getFullYear()} <a href="https://interactivesnacks.com">Interactive Snacks Limited</a> 🍁</section>*/}
				</div>
			</div>
		);
	}
}
