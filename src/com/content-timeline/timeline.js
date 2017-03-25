import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';

import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';

import $Node							from '../../shrub/js/node/node';

export default class ContentTimeline extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			feed: null
		};

		this.makeFeedItem = this.makeFeedItem.bind(this);
	}

	componentDidMount() {
		this.getFeed(
			this.props.node.id,
			this.props.methods ? this.props.methods : ['parent', 'superparent'],
			this.props.types ? this.props.types : ['post'],
			this.props.subtypes ? this.props.subtypes : null,
			this.props.subsubtypes ? this.props.subsubtypes : null
		);
	}
	
	getFeed( id, methods, types, subtypes, subsubtypes ) {
		$Node.GetFeed( id, methods, types, subtypes, subsubtypes )
		.then(r => {
			// If the feed is not empty
			if ( r.feed && r.feed.length ) {
				var keys = r.feed.map(v => v['id']);
				$Node.Get( keys )
					.then(rr => {
						// Make a id mapping object
						let nodemap = {};
						for ( let idx = 0; idx < rr.node.length; idx++ ) {
							nodemap[rr.node[idx].id] = rr.node[idx];
						}
						
						// Using the original keys, return an ordered array of nodes
						let new_state = {
							'feed': keys.map(v => nodemap[v])
						};
						
						this.setState(new_state);
					})
					.catch(err => {
						this.setState({ 'error': err });
					});
			}
			else {
				this.setState({ 'feed': [] });
			}			
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

	makeFeedItem( node ) {
		var path = this.props.path+'/'+node.slug;
		var user = this.props.user;
		var extra = this.props.extra;
		
		if ( node.type === 'post' || node.type === 'game' ) {
			return <ContentPost node={node} user={user} path={path} extra={extra} />;
		}
		else if ( node.type === 'user' ) {
			return <ContentUser node={node} user={user} path={path} extra={extra} />;
		}
		else {
			return <div class='content-base'>Unsupported Node Type: {""+node.type}</div>;
		}
	}

	render( props, {feed, error} ) {
		var ShowFeed = null;
		
		if ( error ) {
			ShowFeed = error;
		}
		else if ( feed ) {
			if ( feed.length ) {
				ShowFeed = feed.map(this.makeFeedItem);
			}
		}
		else {
			ShowFeed = <NavSpinner />;
		}
			
		return (
			<div>
				{props.children}
				{ShowFeed}
			</div>
		);
	}
}
