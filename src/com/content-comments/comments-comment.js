import { h, Component } 				from 'preact/preact';
//import ShallowCompare	 				from 'shallow-compare/index';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import IMG2 							from 'com/img2/img2';

import ContentFooterButtonComments		from 'com/content-footer/footer-button-comments';

import ContentCommentsMarkup			from 'comments-markup';

export default class ContentCommentsComment extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'editing': props.editing ? true : false,
		};
		
		this.onEditing = this.onEditing.bind(this);
		this.onPreview = this.onPreview.bind(this);
	}

	onEditing( e ) {
		console.log( '+comm' );
	}
	onPreview( e ) {
		console.log( '-comm' );
	}
	
	render( {user, comment, author, indent, editing}, state ) {
		if ( author ) {
			var ShowEdit = null;
			if ( user && comment.author === user.id )
				ShowEdit = <div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>;
			
			var ShowReply = null;
			if ( user && user.id )
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
						<div class={"-editing "+state.editing?"-selected":""} onclick={this.onEditing}><SVGIcon>edit</SVGIcon> Edit</div>
						<div class={"-preview "+state.editing?"":"-selected"} onclick={this.onPreview}><SVGIcon>preview</SVGIcon> Preview</div>
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
}
