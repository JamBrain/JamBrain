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
		
		
		this.makeItem = this.makeItem.bind(this);
	}
	
	componentWillReceiveProps( props ) {
		if ( props.node.id === this.state.id )
			return;
		
		// Clear the Feed
		this.setState({ id: props.node.id, feed: [] });
		
		$Node.GetFeed( props.node.id, "post" )
		.then(r => {
			if ( r.feed && Object.keys(r.feed).length ) {
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
	}

	makeItem( node ) {
		var path = this.props.path;//'/'+this.props.node.slug+'/';//this.props.path ? this.props.path : this.props.;
		
		if ( node.type === 'post' || node.type === 'game' ) {
			return <ContentPost node={node} path={path} />;
		}
		else if ( node.type === 'user' ) {
			return <ContentUser node={node} path={path} />;
		}
		else {
			return <div>Unsupported Node Type: {""+node.type}</div>;
		}
	}

	render( {node}, {feed, error} ) {
		if ( node.slug && feed ) {
			return (
				<div id="content">
					{ feed.length ? feed.map(this.makeItem) : "No Posts" }
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
