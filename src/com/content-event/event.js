import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentEventIdea					from 'com/content-event-idea/event-idea';

import $Theme							from '../../shrub/js/theme/theme';

export default class ContentEvent extends Component {
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
	componentWillUnmount() {
	}
	
	render( {node, user, path, extra}, {stats, error} ) {
		if ( node.slug ) {
			var dangerousParsedBody = { __html:marked.parse(node.body) };
			var dangerousParsedTitle = { __html:titleParser.parse('**Event:** '+node.name) };
			
			var url = path+node.slug+'/';
			
			let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;
			
			// Theme Selection
			if ( extra.length && extra[0] === 'theme' ) {
				let ThemeBody = "";

				
				switch (ThemeMode) {
					case 1:
						ThemeBody = <ContentEventIdea node={node} user={user} />
						break;
					default:
						ThemeBody = (
							<div class="-body">
								<h3>Theme Selection: Closed</h3>
								<div>{"This event is either old, has no Theme Selection, or it hasn't started yet"}</div>
							</div>
						);
						break;
				};
				
				return (
					<div class="content-base content-user content-event">
						<div class="-header">
							<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						</div>
						{ThemeBody}
						<div class="-footer">
						</div>
					</div>
				);				
			}
			// Regular View
			else {
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
				
				var ThemeSelectionDiv = ThemeModeText ? <div><SVGIcon>mallet</SVGIcon> {ThemeModeText}</div> : "";
				
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
						<div class="-body">
							<h2>Theme Selection Stats</h2>
							{ShowIdeaCount}
							{ShowUsersWithIdeas}
						</div>
					);
				}
				
				var ShowEventMode = null;
				if ( node.meta && node.meta['theme-mode'] > 0 ) {
					ShowEventMode = (<div><strong>Event Mode:</strong> {ThemeModeName[node.meta['theme-mode']]}</div>);
				}
				
				return (
					<div class="content-base content-user content-event">
						<div class="-header">
							<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						</div>
						<div class="-body markup" dangerouslySetInnerHTML={dangerousParsedBody} />
						<div class="_hidden">Extra Args: {extra.join("/")}</div>
						<div class="-body">
							{ShowEventMode}
						</div>
						<div class="-body">
							<div><SVGIcon>gamepad</SVGIcon> Join Event</div>
							{ThemeSelectionDiv}
						</div>
						{ShowStats}
						<div class="-footer">
						</div>
					</div>
				);
			}
		}
		else {
			return (
				<div class="content-base content-post">
					{ error ? error : "Please Wait..." }
				</div>
			);
		}
	}
}

marked.setOptions({
	highlight: function( code, lang ) {
		var language = Prism.languages.clike;
		if ( Prism.languages[lang] )
			language = Prism.languages[lang];
		return Prism.highlight( code, language );
	},
	sanitize: true,			// disable HTML //
	smartypants: true,		// enable automatic fancy quotes, ellipses, dashes //
});
