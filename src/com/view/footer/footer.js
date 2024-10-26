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
							<a href="https://bsky.app/profile/ludumdare.com" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Bluesky</title><path d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.367 24 .213 24 3.883c0 .733-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.298-5.064 5.197-7.279-1.304-7.847-2.97-.104-.305-.152-.447-.153-.326 0-.121-.05.021-.153.327-.568 1.665-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026Z"/></svg></a>
							<a href="https://bsky.brid.gy/ludumdare.com" target="_blank"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Mastodon</title><path d="M11.965 0c-3.069.025-6.02.357-7.74 1.147 0 0-3.411 1.526-3.411 6.733 0 1.192-.024 2.617.014 4.129.124 5.091.934 10.11 5.641 11.355 2.17.575 4.034.695 5.535.613 2.722-.151 4.25-.972 4.25-.972l-.09-1.974s-1.945.613-4.13.538c-2.164-.074-4.448-.233-4.798-2.89a5.449 5.449 0 0 1-.049-.746s2.125.52 4.817.643c1.646.076 3.19-.096 4.758-.283 3.007-.36 5.626-2.212 5.955-3.905.518-2.667.476-6.508.476-6.508 0-5.207-3.412-6.733-3.412-6.733C18.061.357 15.108.025 12.04 0ZM8.492 4.068c1.278 0 2.246.491 2.886 1.474L12 6.585l.622-1.043c.64-.983 1.608-1.474 2.886-1.474 1.104 0 1.994.388 2.674 1.146.659.757.987 1.781.987 3.07v6.304H16.67v-6.12c0-1.289-.542-1.944-1.628-1.944-1.2 0-1.802.777-1.802 2.312v3.35H10.76v-3.35c0-1.535-.602-2.312-1.802-2.312-1.086 0-1.628.655-1.628 1.945v6.119H4.83V8.284c0-1.289.328-2.313.987-3.07.68-.758 1.57-1.146 2.674-1.146z"/></svg></a>
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
