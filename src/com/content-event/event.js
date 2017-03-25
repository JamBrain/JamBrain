import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

import ContentEventHome					from 'com/content-event/event-home';
import ContentEventIdea					from 'com/content-event/event-idea';
import ContentEventSlaughter			from 'com/content-event/event-slaughter';
import ContentEventFusion				from 'com/content-event/event-fusion';
import ContentEventList					from 'com/content-event/event-list';
//import ContentEventFinal				from 'com/content-event/event-final';
//import ContentEventJudging				from 'com/content-event/event-judging';
//import ContentEventResults				from 'com/content-event/event-results';

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
			var dangerousParsedTitle = { __html:titleParser.parse('**EVENT:** '+node.name) };
			
			let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;
			
			var EventBody = null;
			
			// Internal URLs
			if ( extra.length ) {
				// Theme Selection URL (/theme/)
				if ( extra[0] === 'theme' ) {
					var _path = path + '/' + extra[0];
					var _extra = extra.slice(1);
					
					switch (ThemeMode) {
						case 1:
							EventBody = <ContentEventIdea node={node} user={user} path={_path} extra={_extra} />;
							break;
						case 2:
							EventBody = <ContentEventSlaughter node={node} user={user} path={_path} extra={_extra} />;
							break;
						case 3:
							EventBody = <ContentEventFusion node={node} user={user} path={_path} extra={_extra} />;
							break;
						case 4:
							EventBody = <ContentEventList node={node} user={user} path={_path} extra={_extra} />;
							break;
//						case 5:
//							EventBody = <ContentEventFinal node={node} user={user} path={_path} extra={_extra} />;
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
			
			var EventWhen = null;
			var EventWhere = null;
			if (true) {
				EventWhen = <div class="-when"><SVGIcon baseline small>clock</SVGIcon> <strong>WHEN:</strong> <span>April 21st-24th, 2017</span></div>;
			}
			if ( false ) {
				EventWhere = <div class="-where"><SVGIcon baseline small>location</SVGIcon> <strong>WHERE:</strong> <span>Here (Online)</span></div>;
			}
				
			return (
				<div class="content-base content-user content-event">
					<div class="-header">
						<div class="-title _font2"><SVGIcon baseline small>trophy</SVGIcon> <NavLink href={path} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						{EventWhen}
						{EventWhere}
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
