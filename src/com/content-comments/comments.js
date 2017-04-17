import { h, Component } 				from 'preact/preact';
//import ShallowCompare	 				from 'shallow-compare/index';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import IMG2 							from 'com/img2/img2';

import ContentFooterButtonComments		from 'com/content-footer/footer-button-comments';

import ContentCommentsMarkup			from 'comments-markup';

import ContentCommentsComment			from 'comments-comment';

import $Note							from '../../shrub/js/note/note';
import $Node							from '../../shrub/js/node/node';

export default class ContentComments extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'comment': null,
			'tree': null,
			'authors': null,
			
			'newcomment': null,
		};
		
		this.getComments(props.node);
		
		this.renderComments = this.renderComments.bind(this);
	}
	
//	componentWillMount() {
//		this.getComments(props.node);
//	}

	genComment( editing = true) {
		return {
			'body': '',
			'author': this.props.user.id,
			'node': this.props.node.id,
			'parent': 0,
			
			'editing': editing,
		};
	}
	
	getComments( node ) {
		$Note.Get( node.id )
		.then(r => {
			var nextThen = null;
			if ( r.note && r.note.length ) {
				this.setState({ 'comment': r.note });
				
				// Async first
				this.getAuthors().then( rr => {
					console.log("DOENU",this);
					this.setState({'newcomment': this.genComment()});
				});
				
				// Sync last
				this.buildTree();
			}
			else {
				this.setState({ 'comment': [], 'authors': [], 'tree': {} });
			}
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}
	
	buildTree() {
		var comment = this.state.comment;
		
		// Only supports single level deep trees
		var tree = {};
		for ( var idx = 0; idx < comment.length; idx++ ) {
			if ( comment[idx].parent === 0 ) {
				tree[comment[idx].id] = {
					'node': comment[idx],
				};
			}
			else if ( comment[idx].parent && tree[comment[idx].parent] ) {
				if (!tree[comment[idx].parent].child) {
					tree[comment[idx].parent].child = {};
				}
				
				tree[comment[idx].parent].child[comment[idx].id] = {
					'node': comment[idx],
				};
			}
			else {
				console.log('[Comment] Unable to find parent for '+comment[idx].id);
			}
		}
		
		this.setState({'tree': tree});
	}
	
	getAuthors() {
		if ( this.state.comment && this.state.comment.length ) {
			var Authors = [];
			// Extract a list of all authors from comments
			for ( var idx = 0; idx < this.state.comment.length; idx++ ) {
				Authors.push(this.state.comment[idx].author);
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
/*		
	renderComment( comment, indent = 0, editing = false ) {
		var author = this.state.authors[comment.author];
		if ( author ) {
			var ShowEdit = null;
			if ( this.props.user && comment.author === this.props.user.id )
				ShowEdit = <div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>;
			
			var ShowReply = null;
			if ( this.props.user && this.props.user.id )
				ShowReply = <div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div>;
				
			var Name = author.name;
			if ( author.meta['real-name'] )
				Name = author.meta['real-name'];
				
			var Avatar = "///other/dummy/user64.png";
			if ( author.meta['avatar'] )
				Avatar = author.meta['avatar'];
			
			var ShowTitle = null;
			var ShowBottomNav = null;
			if ( !editing ) {
				ShowTitle = (
					<div class="-title">
						<span class="-author">{Name}</span> (<NavLink class="-atname" href={"/users/"+author.slug}>{"@"+author.slug}</NavLink>)
					</div>
				);

				ShowBottomNav = (
					<div class="-nav">
						<div class="-love"><SVGIcon>heart</SVGIcon> {comment.love}</div>
						{ShowReply}
						{ShowEdit}
					</div>
				);
			}
			
			var ShowTopNav = null;
			if ( editing ) {
				ShowTopNav = (
					<div class="-nav">
						<div class={"-editing "+comment.editing?"-selected":""} onclick={this.onEditing}><SVGIcon>edit</SVGIcon> Edit</div>
						<div class={"-preview "+comment.editing?"":"-selected"} onclick={this.onPreview}><SVGIcon>preview</SVGIcon> Preview</div>
					</div>
				);
			}
			
			return (
				<div class={"-item -comment -indent-"+indent}>
					<div class="-avatar"><IMG2 src={Avatar} /></div>
					<div class="-body">
						{ShowTopNav}
						{ShowTitle}
						<ContentCommentsMarkup class="-text" editing={editing}>{comment.body}</ContentCommentsMarkup>
						{ShowBottomNav}
					</div>
				</div>
			);
		}
		else {
			return (
				<div class={"-item -comment -indent-"+indent}>
					<div class="-body">There was a problem with this node</div>
				</div>
			);
		}
	}
*/
	renderComments( tree, indent = 0 ) {
		var user = this.props.user;
		var authors = this.state.authors;

		var ret = [];

		for ( var item in tree ) {
			//ret.push(this.renderComment(tree[item].node, indent));
			var comment = tree[item].node;
			var author = authors[comment.author];
			ret.push(<ContentCommentsComment user={user} comment={comment} author={author} indent={indent} />);

			if ( tree[item].child ) {
				ret.push(<div class="-indent">{this.renderComments(tree[item].child, indent+1)}</div>);
			}
		}

		return ret;
	}
	
	renderPostNew() {
		var user = this.props.user;
		var authors = this.state.authors;
		var comment = this.state.newcomment;
		var author = authors[comment.author];

		return <ContentCommentsComment user={user} comment={comment} author={author} indent={0} editing />;
//		return this.renderComment(this.state.newcomment, 0, true);
	}
	
	render( props, {comment, tree, authors, newcomment} ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;

		var FooterItems = [];
		if ( !props['no_comments'] )
			FooterItems.push(<ContentFooterButtonComments href={path} node={node} wedge_left_bottom />);
			
		var ShowComments = <NavSpinner />;
		if ( comment && tree && authors ) {
			if ( comment.length )
				ShowComments = this.renderComments(tree);
			else
				ShowComments = <div class={"-item -comment -indent-0"}><div class="-nothing">No Comments.</div></div>;
		}
		
		var ShowPostNew = null;
		console.log(newcomment);
		if ( user && user['id'] && newcomment ) {
			ShowPostNew = this.renderPostNew();
		}
		
		return (
			<div class={['content-base','content-comments',props['no_gap']?'-no-gap':'',props['no_header']?'-no-header':'']}>
				<div class="-headline">COMMENTS</div>
				{ShowComments}
				{ShowPostNew}
				<div class="content-footer content-footer-common -footer">
					<div class="-left">
					</div>
					<div class="-right">
			  			{FooterItems}
			  		</div>
				</div>
			</div>
		);
	}
}
