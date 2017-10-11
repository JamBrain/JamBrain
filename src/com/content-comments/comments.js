import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';

import ContentCommentsComment			from 'comments-comment';

import $Note							from '../../shrub/js/note/note';
import $Node							from '../../shrub/js/node/node';
import $NoteLove						from '../../shrub/js/note/note_love';

export default class ContentComments extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'comments': null,
			'tree': null,
			'authors': null,
			'newcomment': null,
		};

		this.onPublish = this.onPublish.bind(this);
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
		$Note.Get( node.id )
		.then(r => {
			// Has comments
			if ( r.note && r.note.length ) {
				this.setState({ 'comments': r.note, 'tree': null, 'authors': null });
			}
			// Does not have comments
			else if ( r.note ) {
				this.setState({ 'comments': [], 'tree': null, 'authors': null });
			}

			// Async first
			this.getAuthors().then( rr => {
				this.setState({'newcomment': this.genComment()});
			});

			$NoteLove.GetMy(node.id)
			.then(r => {
					this.setState({ "lovedComments": r["my-love"]});

					// Sync last
					this.setState({'tree': this.buildTree()});
			});
		})
		.catch(err => {
			this.setState({ 'error': err });
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
				if (!tree[comments[idx].parent].child) {
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
		var user = this.props.user;
		var comments = this.state.comments;

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
			// http://stackoverflow.com/a/23282067/5678759
			// Remove Duplicates
			Authors = Authors.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

			// Fetch authors

			return $Node.GetKeyed( Authors )
			.then(r => {
				this.setState({ 'authors': r.node });
			})
			.catch(err => {
				this.setState({ 'error': err });
			});
		}
	}

	renderComments( tree, indent = 0 ) {
		var user = this.props.user;
		var authors = this.state.authors;

		var lovedComments = this.state.lovedComments;
		var actualLove = [];
		for ( var item in lovedComments ) {
			actualLove.push(lovedComments[item]['note']);
		}

		var ret = [];

		for ( var item in tree ) {
			var comment = tree[item].node;
			comment.loved = actualLove.indexOf(comment.id) !== -1 ? true : false;
			var author = authors[comment.author];

			if ( tree[item].child ) {
				ret.push(<ContentCommentsComment user={user} comment={comment} author={author} indent={indent}><div class="-indent">{this.renderComments(tree[item].child, indent+1)}</div></ContentCommentsComment>);
			} else {
				ret.push(<ContentCommentsComment user={user} comment={comment} author={author} indent={indent}/>);
			}
		}

		return ret;
	}

	renderPostNew() {
		const user = this.props.user;
		const authors = this.state.authors;
		const comment = this.state.newcomment;
		const author = authors[comment.author];
		const allowAnonymous = parseInt(this.props.node.meta['allow-anonymous-comments']);

		return <div class="-new-comment"><ContentCommentsComment user={user} comment={comment} author={author} indent={0} editing publish onpublish={this.onPublish} nolove allowAnonymous={allowAnonymous} /></div>;
	}

	onPublish( e, publishAnon ) {
		const node = this.props.node;
		const newcomment = this.state.newcomment;

		$Note.Add( newcomment.parent, newcomment.node, newcomment.body, null, publishAnon )
		.then(r => {
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

				this.setState({'tree': this.buildTree()});
			}
			else {
				this.setState({'error': err});
			}
		})
		.catch(err => {
			this.setState({'error': err});
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
			<div class={['content-base','content-common','content-comments',props['no_gap']?'-no-gap':'',props['no_header']?'-no-header':'']}>
				<div class="-headline">COMMENTS</div>
				{ShowComments}
				{ShowPostNew}
				<div class="content-footer content-footer-common -footer" style="height:0" />
			</div>
		);
	}

}
