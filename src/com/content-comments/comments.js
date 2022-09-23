import {h, Component, Fragment} from 'preact';
import cN from 'classnames';

import UISpinner						from 'com/ui/spinner';

import ContentCommentsComment			from './comments-comment';

import $Comment							from 'shrub/js/comment/comment';
import $Node							from 'shrub/js/node/node';
import $CommentLove						from 'shrub/js/comment/comment_love';
import $Notification					from 'shrub/js/notification/notification';

export default class ContentComments extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			comments: null,
			authors: null,

			myNewComment: null,
			isUserSubscribed: null,
		};

		this.onPublish = this.onPublish.bind(this);
		this.onToggleSubscription = this.onToggleSubscription.bind(this);
	}


	componentDidMount() {
		let {node, user} = this.props;

		this._fetchComments(node);
		if ( user && user.id ) {
			this.setState({myNewComment: this._newComment()});
			this._fetchMyCommentLove(node);
			this._fetchMySubscription(node);
		}
	}


	_newComment() {
		return {
			'parent': 0,
			'node': this.props.node.id,
			'author': this.props.user.id,
			'body': '',
			'love': 0,
			'loved': false
		};
	}


	_fetchComments( node ) {
		return $Comment.GetByNode(node.id)
		.then(r => {
			if ( r.status == 200 ) {
				/*
				// Has comments
				if ( r.comment && r.comment.length ) {
					this.setState({'comments': r.comment});//, 'tree': null, 'authors': null});
				}
				// Does not have comments
				else if ( r.comment ) {
					this.setState({'comments': []});//, 'tree': null, 'authors': null});
				}
				*/
				//console.log("got comments", r.comment);

				this.setState({'comments': r.comment});

				return this._fetchAuthors(r.comment);
				/*
				$CommentLove.GetMy(node.id)
				.then(r => {
						this.setState({"lovedComments": r["my-love"]});

						// Sync last
						//this.setState({'tree': this.buildTree()});
				});
				/*
				//User is already loaded
				if ( this.props.user ) {
					this.updateUser(this.props.user);
				}
				*/
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}


	_fetchMyCommentLove( node ) {
		return $CommentLove.GetMy(node.id)
		.then(r => {
			if ( r.status == 200 ) {
				this.setState({"lovedComments": r["my-love"]});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}


	// MK: This is a bit of a wasteful call, returning a single field. Can this be merged with something?
	_fetchMySubscription( node ) {
		return $Notification.GetSubscription( node.id )
		.then(r => {
			// Check if the user is subscribed to this thread
			if ( r.status == 200 ) {
				this.setState({isUserSubscribed: r.subscribed});
			}
		}).catch(err => {
			this.setState({'error': err});
		});

		/*
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
		*/

		/*
		// Determine whether the user has made a comment in this thread.
		let hasComment = false;
		for ( const index in this.state.comments ) {
			if ( this.state.comments[index].author == user.id ) {
				hasComment = true;
				break;
			}
		}
		this.setState({'hascomment': hasComment});
		*/
	}


	_buildTree( comments ) {
		if ( !comments ) {
			return null;
		}

		// Only supports single level deep trees
		let tree = {};

		for ( let comment of comments ) {
			if ( comment.parent === 0 ) {
				tree[comment.id] = {
					'node': comment,
				};
			}
			else if ( comment.parent && tree[comment.parent] ) {
				/*
				// If we can't find parent, create a stub
				if ( !tree[comment.parent] ) {
					tree[comment.parent] = {};
				}
				*/
				// If parent doesn't have a child, create stub
				if ( !tree[comment.parent].child ) {
					tree[comment.parent].child = {};
				}

				tree[comment.parent].child[comment.id] = {
					'node': comment,
				};
			}
			else {
				console.warn('[Comments] Unable to find parent for '+comment.id);
			}
		}

/*
		for ( let idx = 0; idx < comments.length; idx++ ) {
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
*/

		return tree;
	}

	_fetchAuthors( comments ) {
		const {user, node} = this.props;

		let author_ids = [];

		// Add self, in case we decide to make a comment
		if ( user && user.id ) {
			author_ids.push(user.id);
		}

		// Add authors of the node
		if ( node.meta && node.meta.authors ) {
			node.meta.authors.forEach((author) => author_ids.push(author));
		}
		else if (node) {
			author_ids.push(node.author);
		}

		if ( comments ) {
			// Extract a list of all authors from comments
			for ( var comment of comments ) {
				if ( comment.author != 0 ) {
					author_ids.push(comment.author);
				}
			}
		}

		// http://stackoverflow.com/a/23282067/5678759
		// Remove Duplicates
		// Skip anonymous comments (user 0)
		author_ids = author_ids.filter((item, i, ar) => (ar.indexOf(item) === i) && (item > 0));

		// Fetch authors
		return $Node.GetKeyed( author_ids )
		.then(r => {
			// NOTE: No status code because of GetKeyed
			this.setState({'authors': r.node});
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}


	renderComments( state, tree, indent = 0 ) {
		const {user, node} = this.props;
		const {authors, lovedComments} = state;
		const userId = user && user.id !== 0 && user.id;
		const userSlug = userId && `@${user.slug}`;

		let actualLove = [];
		for ( let lovedComment in lovedComments ) {
			actualLove.push(lovedComment['comment']);
		}

		let ret = [];

		for ( let branch in tree ) {
			let comment = tree[branch].node;
			comment.loved = (actualLove.indexOf(comment.id) !== -1) ? true : false;

			let author = authors[comment.author];
			const isMyComment = (comment.author != null) && (comment.author === userId);
			const isMention = !isMyComment && userSlug && (comment.body.indexOf(userSlug) > -1);
			const isNodeAuthor = !isMention && node_IsAuthor(node, {'id': comment.author});

			if ( tree[branch].child ) {
				ret.push(<ContentCommentsComment user={user} node={node} comment={comment} author={author} indent={indent} isMyComment={isMyComment} isNodeAuthor={isNodeAuthor} isMention={isMention}><div class="-indent">{this.renderComments(state, tree[branch].child, indent+1)}</div></ContentCommentsComment>);
			}
			else {
				ret.push(<ContentCommentsComment user={user} node={node} comment={comment} author={author} indent={indent} isMyComment={isMyComment} isNodeAuthor={isNodeAuthor} isMention={isMention} />);
			}
		}

		return <Fragment>{ret}</Fragment>;
	}


	renderPostNew( state ) {
		const {user, node} = this.props;
		const {authors, error, myNewComment: comment, isUserSubscribed} = state;
		const author = (authors && comment && comment.author) ? authors[comment.author] : 0;
		const allowAnonymous = parseInt(node.meta['allow-anonymous-comments']);

		return <div class="-new-comment"><ContentCommentsComment user={user} node={node} comment={comment} author={author} indent={0} editing publish onpublish={this.onPublish} nolove allowAnonymous={allowAnonymous} error={error} subscribed={isUserSubscribed} onsubscribe={this.onToggleSubscription} authors={authors}/></div>;
	}


	onPublish( e, publishAnon ) {
		const {myNewComment, isUserSubscribed} = this.state;

		this.setState({'error': null});

		$Comment.Add(myNewComment.parent, myNewComment.node, myNewComment.body, null, publishAnon)
		.then(r => {
			if ( isUserSubscribed == null ) this.onToggleSubscription();
			if ( r.comment ) {
				var Now = new Date();
				var comment = Object.assign({
					'id': r.comment,
					'created': Now.toISOString(),
					'modified': Now.toISOString(),
					'anonymous': publishAnon,
				}, myNewComment);

				// TODO: insert properly
				this.state.comments.push(comment);

				// Reset myNewComment
				myNewComment.parent = 0;
				myNewComment.body = '';

				//this.setState({'tree': this.buildTree()});//, 'hascomment': true});
			}
			else {
				this.setState({'error': (r.message ? r.message : "Unknown error when posting comment")});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}


	onToggleSubscription() {
		const {node} = this.props;

		$Notification.ToggleSubscription(node.id).then(r => {
			if (r.status == 200) {
				this.setState({isUserSubscribed: r.subscribed});
			}
			else {
				this.setState({'error': 'Could not update subscription status'});
			}
		});
	}


	render( props, state ) {
		let {node, user, path, extra} = props;
		let {comments, authors, myNewComment} = state;

		let tree = this._buildTree(comments);

		//console.log("[com/comments]", "render", comments, authors, tree);

		let ShowComments = <UISpinner />;
		if ( comments && authors ) {
			if ( comments.length )
				ShowComments = this.renderComments(state, tree);
			else
				ShowComments = <div class="-item -comment -indent-0"><div class="-nothing">No Comments.</div></div>;
		}

		let ShowPostNew = null;
		if ( user && user.id && myNewComment ) {
			ShowPostNew = this.renderPostNew(state);
		}
		// Only show "Sign in to post comments" if there user is not logged in (Id: 0)
		else if ( user && !user.id ) {
			ShowPostNew = (
				<div class="-new-comment" style="padding:0">
					<div class={"-item -comment -indent-0"}>
						<div class="-nothing">Sign in to post a comment</div>
					</div>
				</div>
			);
		}

		return (
			<div class={cN("content -common -comments", props['no_gap'] ? '-no-gap' : '', props['no_header'] ? '-no-header' : '')}>
				<div class="-headline">COMMENTS</div>
				{ShowComments}
				{ShowPostNew}
				<div class="content-footer content-footer-common -footer" style="height:0" />
			</div>
		);
	}

}
