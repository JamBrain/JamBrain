import { h, Component } 				from 'preact/preact';
import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';

import $Node							from '../../shrub/js/node/node';

export default class ContentTimeline extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			feed: []
		};
		
		this.componentWillReceiveProps( props );
	}
	
	componentWillReceiveProps( props ) {
		// Clear the Feed
		this.setState({ feed: [] });
		
		$Node.GetFeed( props.node.id )
		.then(r => {
			if ( r.feed ) {
				$Node.Get( Object.keys(r.feed) )
				.then(rr => {
					this.setState({ feed: rr.node });
				})
				.catch(err => {
					this.setState({ error: err });
				});
			}
			else {
				this.setState({ error: "Not found" });
			}			
		})
		.catch(err => {
			this.setState({ error: err });
		})
		
//		// Lookup the author
//		$Node.GetPublishedChildren( props.node.id )
//		.then(r => {
//			
////			if ( r.node && r.node.length ) {
////				this.setState({ author: r.node[0] });
////			}
////			else {
////				this.setState({ error: "Not found" });
////			}
//		})
//		.catch(err => {
//			this.setState({ error: err });
//		});
	}

	makeNode( node ) {		
		if ( node.type === 'post' || node.type === 'game' ) {
			return <ContentPost node={node} />;
		}
		else if ( node.type === 'user' ) {
			return <ContentUser node={node} />;
		}
//		else if ( node.type === 'root' ) {
//			return <ContentTimeline node={node} />;
//		}
		else {
			return <div>Unsupported Node Type: {""+node.type}</div>;
		}
	}
	
	getContent( feed ) {
		return feed.map(this.makeNode);
	}

//	componentDidMount() {
//	}
//	componentWillUnmount() {
//	}

	render( {node}, {feed, error} ) {
		if ( node.slug && feed ) {
			return (
				<div id="content">
					{ this.getContent(feed) }
				</div>
			);
		}
		else {
			return (
				<div id="content">
					{ error ? error : "Please Wait..." }
				</div>
			);
		}
	}
}
