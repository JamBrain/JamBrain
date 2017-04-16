import { h, Component } 				from 'preact/preact';
//import ShallowCompare	 				from 'shallow-compare/index';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import IMG2 							from 'com/img2/img2';

//import ContentBody						from 'com/content-body/body';
//import ContentBodyMarkup				from 'com/content-body/body-markup';
//
//import ContentFooterButtonLove			from 'com/content-footer/footer-button-love';
import ContentFooterButtonComments		from 'com/content-footer/footer-button-comments';

import ContentCommentsMarkup			from 'comments-markup';

import $Note							from '../../shrub/js/note/note';
import $Node							from '../../shrub/js/node/node';

export default class ContentComments extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'comment': null,
			'tree': null,
			'authors': null,
		};
		
		this.getComments(props.node);
		
		this.renderComments = this.renderComments.bind(this);
	}
	
//	componentWillMount() {
//		this.getComments(props.node);
//	}
	
	getComments( node ) {
		$Note.Get( node.id )
		.then(r => {
			if ( r.note && r.note.length ) {
				this.setState({ 'comment': r.note });
				
				// Async first
				this.getAuthors();
				
				// Sync last
				this.buildTree();
			}
			else {
				this.setState({ 'comment': [] });
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

//		return tree;
/*
		console.log('tree', tree);
		//this.setState({'tree':tree});
	
		// Now flatten the tree
		var flat = [];
		for ( var parent in tree ) {
			flat.push({
				'id':parent,
				'comment':tree[parent].comment,
				'indent':0
			});
			// For all children
			for ( var child in tree[parent].child ) {
				flat.push({
					'id':child,
					'comment': tree[parent].child[child].comment,
					'indent':1
				});
			}
		}
		console.log('flat', flat);

		return flat;*/
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
	
			$Node.GetKeyed( Authors )
			.then(r => {
				this.setState({ 'authors': r.node });
			})
			.catch(err => {
				this.setState({ 'error': err });
			});
		}
	}
	
	renderComment( comment, indent = 0 ) {
		var author = this.state.authors[comment.author];
		if ( author ) {
			var ShowEdit = null;
			if ( comment.author == this.props.user )
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
			
			return (
				<div class={"-item -comment -indent-"+indent}>
					<div class="-avatar"><IMG2 src={Avatar} /></div>
					<div class="-body">
						<div class="-title"><span class="-author">{Name}</span> (<NavLink class="-atname" href={"/users/"+author.slug}>{"@"+author.slug}</NavLink>)</div>
						<ContentCommentsMarkup class="-text">{comment.body}</ContentCommentsMarkup>
						<div class="-nav">
							<div class="-love"><SVGIcon>heart</SVGIcon> {comment.love}</div>
							{ShowReply}
							{ShowEdit}
						</div>
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

	renderComments( tree, indent = 0 ) {
		var ret = [];

		for ( var item in tree ) {
			ret.push(this.renderComment(tree[item].node, indent));

			if ( tree[item].child ) {
				ret.push(<div class="-indent">{this.renderComments(tree[item].child, indent+1)}</div>);
			}
		}

//		for ( var idx = 0; idx < flat.length; idx++ ) {
//			ret.push(this.renderComment(flat[idx].comment, flat[idx].indent));
//		}
		
//		var flat = this.buildTree();
//		console.log('oeugd',flat);
//		for ( var idx = 0; idx < flat.length; idx++ ) {
//			ret.push(this.renderComment(flat[idx].comment, flat[idx].indent));
//		}
		
//		// wrong
//		for ( var idx = 0; idx < this.state.comment.length; idx++ ) {
//			ret.push(this.renderComment(this.state.comment[idx]));
//		}
		
		return ret;
	}
	
	render( props, {comment, tree, authors} ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;

		var FooterItems = [];
		if ( !props['no_comments'] )
			FooterItems.push(<ContentFooterButtonComments href={path} node={node} wedge_left_bottom />);
			
		var ShowComments = <NavSpinner />;
		if ( comment && tree && authors )
			ShowComments = this.renderComments(tree);
		
		return (
			<div class={['content-base','content-comments',props['no_gap']?'-no-gap':'',props['no_header']?'-no-header':'']}>
				<div class="-headline">COMMENTS</div>
				{ShowComments}
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


//				<div class="-item -comment -indent-0">
//					<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
//					<div class="-body">
//						<div class="-title"><span class="-author">Mike Kasprzak</span> (<span class="-atname">@PoV</span>)</div>
//						<div class="-text">{"This is a sample comment. Sorry, you can't actually make comments yet."}</div>
//						<div class="-nav">
//							<div class="-love"><SVGIcon>heart</SVGIcon> 1</div>
//							<div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div>
//							<div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>
//						</div>
//					</div>
//				</div>
//				<div class="-indent">
//					<div class="-item -comment -indent-1">
//						<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
//						<div class="-body">
//							<div class="-title"><span class="-author">Mike Kasprzak</span> (<span class="-atname">@PoV</span>)</div>
//							<div class="-text">{"Wow, this is a sample reply to that comment"}</div>
//							<div class="-nav">
//								<div class="-love"><SVGIcon>heart</SVGIcon> 0</div>
//								<div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div>
//								<div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>
//							</div>
//						</div>
//					</div>
//					<div class="-item -comment -indent-1">
//						<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
//						<div class="-body">
//							<div class="-title"><span class="-author">Mike Kasprzak</span> (<span class="-atname">@PoV</span>)</div>
//							<div class="-text">{"Double wow! This is another reply."}<br /><br />{"Amazing!"}</div>
//							<div class="-nav">
//								<div class="-love"><SVGIcon>heart</SVGIcon> 0</div>
//								<div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div>
//								<div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>
//							</div>
//						</div>
//					</div>
//				</div>
//				<div class="-item -comment -indent-0">
//					<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
//					<div class="-body">
//						<div class="-title"><span class="-author">Mike Kasprzak</span> (<span class="-atname">@PoV</span>)</div>
//						<div class="-text">{"I was late to the party"}</div>
//						<div class="-nav">
//							<div class="-love"><SVGIcon>heart</SVGIcon> 0</div>
//							<div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div>
//							<div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>
//						</div>
//					</div>
//				</div>