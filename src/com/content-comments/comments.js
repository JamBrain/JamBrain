import {h, Component}	 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';

import ContentCommentsComment			from 'comments-comment';

import $Comment							from 'shrub/js/comment/comment';
import $Node							from 'shrub/js/node/node';
import $CommentLove						from 'shrub/js/comment/comment_love';
import $Notification					from 'shrub/js/notification/notification';

export default class ContentComments extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'comments': null,
			'tree': null,
			'authors': null,
			'newcomment': null,
			'subscribed': null,
			'hascomment': false,
			'isauthor': false,
		};

		this.onPublish = this.onPublish.bind(this);
		this.onToggleSubscribe = this.onToggleSubscribe.bind(this);
	}

	componentWillMount() {
		this.getComments(this.props.node);
	}

	genComment() {
		return {
			'parent': 0,
			'node': this.props.node.id,
			'author': this.props.user.id,
			'body': '',
			'love': 0,
			'loved': false
		};
	}

	getComments( node ) {
		let user = this.props.user;
		if ( user && user.id ) {
			$Notification.GetSubscription( node.id )
			.then(r => {
				// Determine whether user is subscribed to the thread explicitly
				if (r.status == 200) this.setState({'subscribed': r.subscribed});
			});
		}

		$Comment.GetByNode(node.id)
		.then(r => {
			// Determine if current user is one of the authors of this node
			let isauthor = false;
			if ( node.meta && node.meta.authors ) {
				for ( const index in node.meta.authors ) {
					if ( node.meta.authors[index] == user.id ) {
						isauthor = true;
						break;
					}
				}
			}
			if ( node.author == user.id ) {
				isauthor = true;
			}
			this.setState({'isauthor': isauthor});

			// Has comments
			if ( r.note && r.note.length ) {
				// Determine whether the user has made a comment in this thread.
				let hasComment = false;
				for ( const index in r.note ) {
					if ( r.note[index].author == user.id ) {
						hasComment = true;
						break;
					}
				}
				this.setState({'comments': r.note, 'tree': null, 'authors': null, 'hascomment': hasComment});
			}
			// Does not have comments
			else if ( r.note ) {
				this.setState({'comments': [], 'tree': null, 'authors': null});
			}

			// Async first
			this.getAuthors().then( rr => {
				this.setState({'newcomment': this.genComment()});
			});

			$CommentLove.GetMy(node.id)
			.then(r => {
					this.setState({"lovedComments": r["my-love"]});

					// Sync last
					this.setState({'tree': this.buildTree()});
			});
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	buildTree() {
		var comments = this.state.comments;

		// Only supports single level deep trees
		var tree = {};
		for ( var idx = 0; idx < comments.length; idx++ ) {
			if ( comments[idx].parent === 0 ) {
				tree[comments[idx].id] = {
					'node': comments[idx],
					//'loved': lovedComments.indexOf(comments[idx].id) !== -1 ? true : false
				};
			}
			else if ( comments[idx].parent && tree[comments[idx].parent] ) {
				if ( !tree[comments[idx].parent].child ) {
					tree[comments[idx].parent].child = {};
				}

				tree[comments[idx].parent].child[comments[idx].id] = {
					'node': comments[idx],
				};
			}
			else {
				console.log('[Comments] Unable to find parent for '+comments[idx].id);
			}
		}

		return tree;
	}

	getAuthors() {
		const {user, node} = this.props;
		const comments = this.state.comments;

		if ( comments ) {
			var Authors = [];
			// Extract a list of all authors from comments
			for ( var idx = 0; idx < comments.length; idx++ ) {
				if ( comments[idx].author != 0 ) {
					Authors.push(comments[idx].author);
				}
			}
			// Add self (in case we start making comments
			if ( user && user.id ) {
				Authors.push(user.id);
			}

			// Add authors from node
			if ( node.meta && node.meta.authors ) {
				node.meta.authors.forEach((author) => Authors.push(author));
			}
			else if (node) {
				Authors.push(node.author);
			}

			// http://stackoverflow.com/a/23282067/5678759
			// Remove Duplicates
			// Skip anonymous comments (user 0)
			Authors = Authors.filter((item, i, ar) => (ar.indexOf(item) === i) && (item > 0));

			// Fetch authors

			return $Node.GetKeyed( Authors )
			.then(r => {
				this.setState({'authors': r.node});
			})
			.catch(err => {
				this.setState({'error': err});
			});
		}
	}

	renderComments( tree, indent = 0 ) {
		const {user, node} = this.props;
		const {authors, lovedComments} = this.state;
		const userId = user && user.id !== 0 && user.id;
		const userSlug = userId && `@${user.slug}`;

		const actualLove = [];
		for ( var item in lovedComments ) {
			actualLove.push(lovedComments[item]['note']);
		}

		const ret = [];

		for ( var item in tree ) {
			var comment = tree[item].node;
			comment.loved = (actualLove.indexOf(comment.id) !== -1) ? true : false;
			var author = authors[comment.author];
			const isMyComment = comment.author != null && comment.author === userId;
			const isMention = !isMyComment && userSlug && comment.body.indexOf(userSlug) > -1;
			const isNodeAuthor = !isMention && node_IsAuthor(node, {'id': comment.author});
			if ( tree[item].child ) {
				ret.push(<ContentCommentsComment user={user} node={node} comment={comment} author={author} indent={indent} isMyComment={isMyComment} isNodeAuthor={isNodeAuthor} isMention={isMention}><div class="-indent">{this.renderComments(tree[item].child, indent+1)}</div></ContentCommentsComment>);
			}
			else {
				ret.push(<ContentCommentsComment user={user} node={node} comment={comment} author={author} indent={indent} isMyComment={isMyComment} isNodeAuthor={isNodeAuthor} isMention={isMention} />);
			}
		}

		return ret;
	}

	renderPostNew() {
		const {user, node} = this.props;
		const {authors, error, "newcomment": comment, subscribed} = this.state;
		const author = authors[comment.author];
		const allowAnonymous = parseInt(this.props.node.meta['allow-anonymous-comments']);

		return <div class="-new-comment"><ContentCommentsComment user={user} node={node} comment={comment} author={author} indent={0} editing publish onpublish={this.onPublish} nolove allowAnonymous={allowAnonymous} error={error} subscribed={subscribed} onsubscribe={this.onToggleSubscribe} authors={authors}/></div>;
	}

	onPublish( e, publishAnon ) {
		const {node} = this.props;
		const {newcomment, subscribed} = this.state;

		this.setState({'error': null});

		$Comment.Add(newcomment.parent, newcomment.node, newcomment.body, null, publishAnon)
		.then(r => {
			if (subscribed == null) this.onToggleSubscribe();
			if ( r.note ) {
				var Now = new Date();
				var comment = Object.assign({
					'id': r.note,
					'created': Now.toISOString(),
					'modified': Now.toISOString(),
					'anonymous': publishAnon,
				}, newcomment);

				// TODO: insert properly
				this.state.comments.push(comment);

				// Reset newcomment
				newcomment.parent = 0;
				newcomment.body = '';

				this.setState({'tree': this.buildTree(), 'hascomment': true});
			}
			else {
				this.setState({'error': (r.message ? r.message : "Unknown error when posting comment")});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	onToggleSubscribe() {
		const {subscribed} = this.state;
		let promise = null;
		if ( subscribed ) {
			promise = $Notification.Unsubscribe( this.props.node.id );
		}
		else {
			promise = $Notification.Subscribe( this.props.node.id );
		}

		promise.then(r => {
			if (r.status == 200) {
					this.setState({'subscribed': r.subscribed});
			}
			else
			{
					this.setState({'error': 'Could update subscription status'});
			}
		});
	}

	render( props, {comments, tree, authors, newcomment} ) {
		let {node, user, path, extra} = props;

		var ShowComments = <NavSpinner />;
		if ( comments && tree && authors ) {
			if ( comments.length )
				ShowComments = this.renderComments(tree);
			else
				ShowComments = <div class={"-item -comment -indent-0"}><div class="-nothing">No Comments.</div></div>;
		}

		var ShowPostNew = null;
		if ( user && user['id'] && newcomment ) {
			ShowPostNew = this.renderPostNew();
		}
		else {
			ShowPostNew = <div class="-new-comment" style="padding:0"><div class={"-item -comment -indent-0"}><div class="-nothing">Sign in to post a comment</div></div></div>;
		}

		return (
			<div class={cN("content-base content-common content-comments", props['no_gap'] ? '-no-gap' : '', props['no_header'] ? '-no-header' : '')}>
				<div class="-headline">COMMENTS</div>
				{ShowComments}
				{ShowPostNew}
				<div class="content-footer content-footer-common -footer" style="height:0" />
			</div>
		);
	}

}
