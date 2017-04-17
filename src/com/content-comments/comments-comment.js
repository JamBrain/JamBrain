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
			'preview': props.editing ? false : true,
			'modified': false,
			
			// NOTE: Set this upon save, or use it to cancel
			'original': props.body,
			
			'loved': props.loved ? true: false,
		};
		
		this.onEditing = this.onEditing.bind(this);
		this.onPreview = this.onPreview.bind(this);
		
		this.onModify = this.onModify.bind(this);

		this.onEdit = this.onEdit.bind(this);

		this.onSave = this.onSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onPublish = this.onPublish.bind(this);

		this.onLove = this.onLove.bind(this);
		this.onReply = this.onReply.bind(this);
	}

	onEditing( e ) {
		this.setState({'preview': false});
	}
	onPreview( e ) {
		this.setState({'preview': true});
	}
	
	onModify( e ) {
		this.props.comment.body = e.target.value;
		this.setState({'modified': true});
	}

	onCancel( e ) {
		console.log('cancel');
		this.props.comment.body = this.state.original;
		this.setState({'modified': false, 'editing': false, 'preview': false});		
	}

	onSave( e ) {
		console.log('save');
		this.setState({'modified': false, 'editing': false, 'preview': false, 'original': this.props.comment.body});
	}

	onPublish( e ) {
		console.log('pub');
		if ( this.props.onPublish )
			this.props.onPublish(e);
	}
	
	onEdit( e ) {
		console.log('edit');
		this.setState({'editing': true, 'preview': false});
	}
	
	onLove( e ) {
		console.log('love');
		this.setState({'loved': true });
	}
	onReply( e ) {
		console.log('reply');
	}
	
	render( {user, comment, author, indent, publish}, state ) {
		if ( author ) {
			var ShowEdit = null;
			if ( user && comment.author === user.id )
				ShowEdit = <div class="-edit" onclick={this.onEdit}><SVGIcon>edit</SVGIcon> Edit</div>;
			
			var ShowReply = null;
			if ( user && user.id )
				ShowReply = <div class="-reply" onclick={this.onReply}><SVGIcon>reply</SVGIcon> Reply</div>;
				
			var Name = author.name;
			if ( author.meta['real-name'] )
				Name = author.meta['real-name'];
				
			var Avatar = "///other/dummy/user64.png";
			if ( author.meta['avatar'] )
				Avatar = author.meta['avatar'];
			
			var ShowTitle = null;
			if ( !state.editing || state.preview ) {
				ShowTitle = (
					<div class="-title">
						<span class="-author">{Name}</span> (<NavLink class="-atname" href={"/users/"+author.slug}>{"@"+author.slug}</NavLink>)
					</div>
				);
			}

			var ShowBottomNav = null;
			if ( !state.editing ) {
				ShowBottomNav = (
					<div class="-nav">
						<div class={"-love"+state.loved?" -loved":""} onclick={this.onLove}><SVGIcon>heart</SVGIcon> {comment.love}</div>
						{ShowReply}
						{ShowEdit}
					</div>
				);
			}
			
			var ShowTopNav = null;
			if ( state.editing ) {
				var PreviewEdit = null;
				if ( !state.preview ) {
					PreviewEdit = [
						<div class="-editing -selected"><SVGIcon>edit</SVGIcon> Edit</div>,
						<div class="-preview" onclick={this.onPreview}><SVGIcon>preview</SVGIcon> Preview</div>
					];
				}
				else {
					PreviewEdit = [
						<div class="-editing" onclick={this.onEditing}><SVGIcon>edit</SVGIcon> Edit</div>,
						<div class="-preview -selected"><SVGIcon>preview</SVGIcon> Preview</div>
					];
				}
				
				if ( publish ) {
					PreviewEdit.push(<div class="-publish" onclick={this.onPublish}><SVGIcon>publish</SVGIcon> Publish</div>);
				}
				else {
					PreviewEdit.push(<div class="-cancel" onclick={this.onCancel}><SVGIcon>cross</SVGIcon> Cancel</div>);
					PreviewEdit.push(<div class={"-save"+(state.modified?" -modified":"")} onclick={this.onSave}><SVGIcon>save</SVGIcon> Save</div>);
				}
				
				ShowTopNav = (
					<div class="-nav">
						{PreviewEdit}
					</div>
				);
			}
			
			return (
				<div class={"-item -comment -indent-"+indent}>
					<div class="-avatar"><IMG2 src={Avatar} /></div>
					<div class="-body">
						{ShowTopNav}
						{ShowTitle}
						<ContentCommentsMarkup class="-text" editing={state.editing && !state.preview} onmodify={this.onModify}>{comment.body}</ContentCommentsMarkup>
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
