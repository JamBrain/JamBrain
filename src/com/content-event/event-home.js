import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import $Theme							from 'shrub/js/theme/theme';
import marked 							from 'internal/marked/marked';


export default class ContentEventHome extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'stats': null
		};
	}

	componentDidMount() {
		$Theme.GetStats(this.props.node.id)
		.then(r => {
			if ( r.stats ) {
				this.setState({ 'stats': r.stats });
			}
			else {
				this.setState({ 'stats': null });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}


	render( {node, /*user,*/ path, extra}, {stats /*, error*/} ) {
		let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;

		var ThemeModeText = "";
		switch ( ThemeMode ) {
			case 1:
				ThemeModeText = "Suggest Themes";
				break;
			case 2:
				ThemeModeText = "Slaughter Themes";
				break;
			case 3:
				ThemeModeText = "Fuse Themes";
				break;
			case 4:
				ThemeModeText = "Vote for Themes";
				break;
			case 5:
				ThemeModeText = "Vote for Final Theme";
				break;
		};

		var ThemeModeName = [
			"",
			"Theme Suggestion",
			"Theme Slaughter",
			"Theme Fusion",
			"Theme Voting",
			"Final Round Theme Voting",
			""
		];

		var ThemeSelectionDiv = ThemeModeText ? <NavLink href={path+'/theme'} class="-item"><SVGIcon>mallet</SVGIcon> {ThemeModeText}</NavLink> : "";

		var ShowStats = null;
		if ( stats ) {
			let ShowIdeaCount = null;
			if ( stats.idea && stats.idea.ideas ) {
				ShowIdeaCount = (<div><strong>Total Suggestions:</strong> {stats.idea.ideas}</div>);
			}
			let ShowUsersWithIdeas = null;
			if ( stats.idea && stats.idea.users ) {
				ShowUsersWithIdeas = (<div><strong>Suggested by:</strong> {stats.idea.users} user(s)</div>);
			}

			ShowStats = (
				<div class="">
					<h2><SVGIcon baseline small>stats</SVGIcon> Theme Selection Stats</h2>
					{ShowIdeaCount}
					{ShowUsersWithIdeas}
				</div>
			);
		}

		var ShowEventMode = null;
		if ( node.meta && node.meta['theme-mode'] > 0 ) {
			ShowEventMode = (<div><strong>ON NOW:</strong> {ThemeModeName[node.meta['theme-mode']]}</div>);
		}

		var markedOptions = {
			highlight: function(code, lang) {
				var language = Prism.languages.clike;
				if (Prism.languages[lang])
					language = Prism.languages[lang];
				return Prism.highlight(code, language);
			},
			sanitize: true, // disable HTML
			smartypants: true, // enable automatic fancy quotes, ellipses, dashes
			langPrefix: 'language-'
		};

		// NOTE: only parses the first child
		//var Text = props.children.length ? marked.parse(props.children[0]) : "";
		var mrkd = new marked();
		markdown = mrkd.parse(_body, markedOptions);

		return (
			<div class="-body">
				<div class="markup">{markdown}</div>
				<div class="_hidden">Extra Args: {extra.join("/")}</div>
				<div class="">
					{ShowEventMode}
				</div>
				<div class="event-nav">
					<NavLink class="-item -selected"><SVGIcon>feed</SVGIcon> Feed</NavLink>
					<NavLink class="-item"><SVGIcon>news</SVGIcon> News</NavLink>
					<NavLink class="-item"><SVGIcon>gamepad</SVGIcon> Join Event</NavLink>
					{ThemeSelectionDiv}
				</div>
				{ShowStats}
			</div>
		);
	}
}
