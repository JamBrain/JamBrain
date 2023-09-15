import {Component} from 'preact';
import {UIIcon} from 'com/ui';
import NavLink 							from 'com/nav-link/link';
import marked 							from 'internal/marked/marked';

import $Theme							from 'backend/js/theme/theme';


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
		let EventMode = (node.meta['event-mode']) ? Number(node.meta['event-mode']) : 0;

		var EventModeText = "";
		switch ( EventMode ) {
			case 1:
				EventModeText = "Suggest Themes";
				break;
			case 2:
				EventModeText = "Slaughter Themes";
				break;
			case 3:
				EventModeText = "Fuse Themes";
				break;
			case 4:
				EventModeText = "Vote for Themes";
				break;
			case 5:
				EventModeText = "Vote for Final Theme";
				break;
		};

		var EventModeName = [
			"",
			"Theme Suggestion",
			"Theme Slaughter",
			"Theme Fusion",
			"Theme Voting",
			"Final Round Theme Voting",
			""
		];

		var ThemeSelectionDiv = EventModeText ? <NavLink href={path+'/theme'} class="-item"><UIIcon>mallet</UIIcon> {EventModeText}</NavLink> : "";

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
					<h2><UIIcon baseline small>stats</UIIcon> Theme Selection Stats</h2>
					{ShowIdeaCount}
					{ShowUsersWithIdeas}
				</div>
			);
		}

		var ShowEventMode = null;
		if ( node.meta && node.meta['event-mode'] > 0 ) {
			ShowEventMode = (<div><strong>ON NOW:</strong> {EventModeName[node.meta['event-mode']]}</div>);
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
					<NavLink class="-item -selected"><UIIcon>feed</UIIcon> Feed</NavLink>
					<NavLink class="-item"><UIIcon>news</UIIcon> News</NavLink>
					<NavLink class="-item"><UIIcon>gamepad</UIIcon> Join Event</NavLink>
					{ThemeSelectionDiv}
				</div>
				{ShowStats}
			</div>
		);
	}
}
