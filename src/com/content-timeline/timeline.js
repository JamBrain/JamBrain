import { h, Component } 				from 'preact/preact';
import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';

import $Node							from '../../shrub/js/node/node';

export default class ContentTimeline extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			id: 0,
			feed: []
		};
		
		this.componentWillReceiveProps( props );
	}
	
	componentWillReceiveProps( props ) {
		if ( props.node.id === this.state.id )
			return;
		
		// Clear the Feed
		this.setState({ id: props.node.id, feed: [] });
		
		$Node.GetFeed( props.node.id, "site" )
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

	makeItem( node ) {
		if ( node.type === 'post' || node.type === 'game' ) {
			return <ContentPost node={node} />;
		}
		else if ( node.type === 'user' ) {
			return <ContentUser node={node} />;
		}
		else {
			return <div>Unsupported Node Type: {""+node.type}</div>;
		}
	}

	render( {node}, {feed, error} ) {
		if ( node.slug && feed ) {
			return (
				<div id="content">
					{ feed.map(this.makeItem) }
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
