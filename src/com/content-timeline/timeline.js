import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

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
		this.setState({ feed: {} });
		
		$Node.GetFeed( props.node.id )
		.then(r => {
			if ( r.node && r.node.length ) {
				//this.setState({ feed: r.feed });
				console.log('r',r);
				$Node.Get( r.feed )
				.then(rr => {
					console.log('rr',rr);
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
			return <div>hUnsupported Node Type: {""+node.type}</div>;
		}
	}
	
	getContent( feed ) {
		console.log("hurr",feed);
		var ret = [];
		for ( var node in feed ) {
			console.log(node);
			ret.push( node.slug );
		}
		return ret;
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
