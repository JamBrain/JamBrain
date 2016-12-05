import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

import ContentEventHome					from 'com/content-event-home/event-home';
import ContentEventIdea					from 'com/content-event-idea/event-idea';
import ContentEventSlaughter			from 'com/content-event-slaughter/event-slaughter';
import ContentEventFusion				from 'com/content-event-fusion/event-fusion';
import ContentEventList					from 'com/content-event-list/event-list';
//import ContentEventFinal				from 'com/content-event-final/event-final';
//import ContentEventJudging				from 'com/content-event-judging/event-judging';
//import ContentEventResults				from 'com/content-event-results/event-results';

export default class ContentEvent extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}
	componentWillUnmount() {
	}
	
	render( {node, user, path, extra}, {error} ) {
		if ( node.slug ) {
			var dangerousParsedTitle = { __html:titleParser.parse('**Event:** '+node.name) };
			
			var url = path+node.slug+'/';
			
			let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;
			
			var EventBody = null;
			
			// Internal URLs
			if ( extra.length ) {
				// Theme Selection URL (/theme/)
				if ( extra.length && extra[0] === 'theme' ) {
					switch (ThemeMode) {
						case 1:
							EventBody = <ContentEventIdea node={node} user={user} />
							break;
						case 2:
							EventBody = <ContentEventSlaughter node={node} user={user} />
							break;
						case 3:
							EventBody = <ContentEventFusion node={node} user={user} />
							break;
						case 4:
							EventBody = <ContentEventList node={node} user={user} />
							break;
//						case 5:
//							EventBody = <ContentEventFinal node={node} user={user} />
//							break;
						default:
							EventBody = (
								<div>
									<h3>Theme Selection: Closed</h3>
									<div>{"This event is either old, has no Theme Selection, or it hasn't started yet"}</div>
								</div>
							);
							break;
					};
				}
				else {
					// TODO: emit 404
					EventBody = (
						<div>
							<h3>404</h3>
						</div>
					);
				}
			}
			else {
				EventBody = (<ContentEventHome node={node} user={user} path={path} extra={extra} />);
			}
				
			return (
				<div class="content-base content-user content-event">
					<div class="-header">
						<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
					</div>
					{EventBody}
					<div class="-footer">
					</div>
				</div>
			);
		}
		else {
			return (
				<div class="content-base content-post">
					{ error ? error : <NavSpinner /> }
				</div>
			);
		}
	}
}
