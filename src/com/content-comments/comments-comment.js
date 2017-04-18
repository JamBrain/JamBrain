import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import IMG2 							from 'com/img2/img2';

import ContentFooterButtonComments		from 'com/content-footer/footer-button-comments';

import ContentCommentsMarkup			from 'comments-markup';

import $Note							from '../../shrub/js/note/note';

export default class ContentCommentsComment extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'editing': !!props.editing,
			'preview': !props.editing,
			'modified': false,
			
			// NOTE: Set this upon save, or use it to cancel
			'original': props.comment.body,
			
			'loved': props.loved ? true: false,
			'cursorPos': props.comment.body.length,
		};
		
//		console.log('C '+props.comment.id+": ", this.state.editing,this.state.preview);
		
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

//	shouldComponentUpdate( nextProps, nextState ) {
//		return shallowDiff(this.props, nextProps);
////		return ShallowCompare(this, nextProps, nextState);
//	}

	componentWillReceiveProps( nextProps ) {
//		console.log('err', nextProps);

//		if ( nextProps.editing ) {
//			this.setState({
//				'editing': nextProps.editing ? true : false,
//				'preview': nextProps.editing ? false : true,
//			});
//		}
		
//		if ( shallowDiff(this.props.comment, nextProps.comment) ) {
//			this.setState(
//		}
//		
//		console.log("MEEEEEEEEEEEEEEEEEEEEE", this.props.author);
//		console.log("HEEEEEEEEEEEEEEEEEEEEE", nextProps.author);
	}

	onEditing( e ) {
		console.log('** Edit Comment');
		this.setState({'preview': false});
	}
	onPreview( e ) {
		console.log('** Preview Comment');
		this.setState({'preview': true});
	}
	
	canSave() {
		return this.props.comment.body.trim().length > 1;
	}
	
	onModify( e ) {
		this.props.comment.body = e.target.value;
		e.preventDefault();
		this.setState({'modified': this.canSave(), 'cursorPos': e.target.selectionEnd});
	}

	onCancel( e ) {
		console.log('cancel');
		this.props.comment.body = this.state.original;
		this.setState({'modified': false, 'editing': false, 'preview': false});		
	}

	onSave( e ) {
		var comment = this.props.comment;
		
		$Note.Update( comment.id, comment.node, comment.body )
		.then(r => {
			console.log(r);
			
			this.setState({'modified': false, 'editing': false, 'preview': false, 'original': this.props.comment.body});
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

	onPublish( e ) {
		if ( this.canSave() ) {
			if ( this.props.onpublish ) {
				this.props.onpublish(e);

				//this.setState({'modified': false, 'editing': true, 'preview': false});
			}
		}
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
	
	render( {user, comment, author, indent, publish, onpublish, limit}, state ) {
//		console.log('R '+comment.id+": ", this.state.editing,this.state.preview);
		if ( author ) {
			var Name = author.name;
			if ( author.meta['real-name'] )
				Name = author.meta['real-name'];
				
			var Avatar = "///other/dummy/user64.png";
			if ( author.meta['avatar'] )
				Avatar = author.meta['avatar'];
			
			var ShowTitle = null;
			if ( !state.editing || state.preview ) {
				var Created = new Date(comment.created);
				var Modified = new Date(comment.modified);
				var Now = new Date();
				var DateDiff = (Now.getTime() - Created.getTime());
				var ModDiff = (Modified.getTime() - Created.getTime());
				
				// 1 minute leeway on edits
				var HasEdited = ModDiff > (60*1000);
				
				ShowTitle = [
					<div class="-title">
						<span class="-author">{Name}</span> (<NavLink class="-atname" href={"/users/"+author.slug}>{"@"+author.slug}</NavLink>)
					</div>,
					<div class="-date">posted <span title={getLocaleDate(Created)}>{getRoughAge(DateDiff)}</span><span title={getLocaleDate(Modified)}>{HasEdited?" (edited)":""}</span></div>
				];
			}

			var ShowReply = null;
//			if ( user && user.id )
//				ShowReply = <div class="-reply" onclick={this.onReply}><SVGIcon>reply</SVGIcon> Reply</div>;

			var ShowEdit = null;
			if ( user && comment.author === user.id && !state.editing )
				ShowEdit = <div class="-edit" onclick={this.onEdit}><SVGIcon>edit</SVGIcon> Edit</div>;

			var ShowBottomNav = null;
			//if ( !state.editing ) 
			{
				ShowBottomNav = (
					<div class="-nav">
						{ShowReply}
						{ShowEdit}
						<div class={"-love"+(state.loved?" -loved":"")} onclick={this.onLove}><SVGIcon>heart</SVGIcon> {comment.love}</div>
					</div>
				);
			}
			
			var ShowTopNav = null;
			if ( state.editing ) {
				var PreviewEdit = null;
				if ( !state.preview ) {
					PreviewEdit = [
						<div class="-preview" onclick={this.onPreview}><SVGIcon>preview</SVGIcon> Preview</div>,
						<div class="-editing -selected"><SVGIcon>edit</SVGIcon> Edit</div>,
					];
				}
				else {
					PreviewEdit = [
						<div class="-preview -selected"><SVGIcon>preview</SVGIcon> Preview</div>,
						<div class="-editing" onclick={this.onEditing}><SVGIcon>edit</SVGIcon> Edit</div>,
					];
				}
				
				if ( publish ) {
					PreviewEdit.push(<div class={"-publish"+(state.modified?" -modified":"")} onclick={this.onPublish}><SVGIcon>publish</SVGIcon> Publish</div>);
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
						<ContentCommentsMarkup class="-text" editing={state.editing && !state.preview} onmodify={this.onModify} placeholder="type a comment here" limit={limit} cursorPos={state.cursorPos}>{comment.body}</ContentCommentsMarkup>
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
