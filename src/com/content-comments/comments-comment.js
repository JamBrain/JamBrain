import {h, Component} from 'preact';
import cN from 'classnames';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import ButtonLink 						from 'com/button-link/link';
import UIIcon 							from 'com/ui/icon';
import UIImage 							from 'com/ui/image';
import UICheckbox from 'com/ui/checkbox/checkbox';

import ContentCommentsMarkup from './comments-markup';
import {AutocompleteAtNames, AutocompleteEmojis} from 'com/content-common/common-autocomplete';
import $Comment from 'shrub/js/comment/comment';
import $CommentLove from 'shrub/js/comment/comment_love';


export default class ContentCommentsComment extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'editing': !!props.editing,
			'preview': !props.editing,
			'modified': false,

			// NOTE: Set this upon save, or use it to cancel
			'original': props.comment.body,

			'loved': !!props.comment.loved,
			'lovecount': props.comment.love,
		};

		// A bit of a hack but important that changing this doesn't trigger render
		// and easier to keep outside state.
		this.autocompleters = {};

		this.onEditing = this.onEditing.bind(this);
		this.onPreview = this.onPreview.bind(this);

		this.onModify = this.onModify.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onEdit = this.onEdit.bind(this);

		this.onSave = this.onSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onToggleAnon = this.onToggleAnon.bind(this);
		this.onPublish = this.onPublish.bind(this);
		this.onLove = this.onLove.bind(this);
		this.onReply = this.onReply.bind(this);
		this.onSubscribe = this.onSubscribe.bind(this);

		this.onTextAreaBlur = this.onTextAreaBlur.bind(this);
		this.onTextAreaFocus = this.onTextAreaFocus.bind(this);
		this.onTextAreaCaret = this.onTextAreaCaret.bind(this);

		this.onAutocompleteSelect = this.onAutocompleteSelect.bind(this);
		this.onAutoselectCaptureKeyDown = this.onAutoselectCaptureKeyDown.bind(this);
		this.onAutoselectCaptureKeyUp = this.onAutoselectCaptureKeyUp.bind(this);
	}

	componentWillUpdate( newProps, newState ) {
		if (newState.preview && this.state.preview && newProps.comment.body !== this.props.comment.body && (!newProps.comment.body || newProps.comment.body.length === 0)) {
			this.setState({'preview': false});
		}
	}

	onEditing( e ) {
		this.setState({'preview': false});
	}
	onPreview( e ) {
		this.setState({'preview': true});
	}

	canSave() {
		return (this.props.comment.body.trim().length >= 1);
	}

	onModify( e ) {
		this.props.comment.body = e.target.value;
		this.setState({
			'modified': this.canSave(),
			'editText': e.target.value,
			'editCursorPos': e.target.selectionStart,
			'replaceText': null,
			'textareaFocus': true,
		});
		return true;
	}

	onKeyDown( e ) {
		const {autocompleters} = this;
		for ( let autocompleter in autocompleters ) {
			const ac = autocompleters[autocompleter];
			if ( ac.captureKeyDown && !ac.captureKeyDown(e) ) {
				return false;
			}
		}
		return true;
	}

	onKeyUp( e ) {
		const {autocompleters} = this;
		for ( let autocompleter in autocompleters ) {
			const ac = autocompleters[autocompleter];
			if ( ac.captureKeyUp && !ac.captureKeyUp(e) ) {
				return false;
			}
		}
		return true;
	}

	onTextAreaFocus( e ) {
		this.setState({'textareaFocus': true});
		//console.log("TextAreaFocus");
		return true;
	}

	onTextAreaBlur( e ) {
		setTimeout(() => this.setState({'textareaFocus': false}), 300);
		return true;
	}

	onTextAreaCaret( e ) {
		this.setState({'editCursorPos': e.target.selectionStart});
		//console.log("TextAreaCursor");
		return true;
	}

	onCancel( e ) {
		this.setState(prevState => {
			// MK: Is this allowed?
			this.props.comment.body = prevState.original;
			return {'modified': false, 'editing': false, 'preview': false};
		});
	}

	onSave( e ) {
		let comment = this.props.comment;

		$Comment.Update( comment.id, comment.node, comment.body )
		.then(r => {
			//console.log(r);

			this.setState({'modified': false, 'editing': false, 'preview': false, 'original': this.props.comment.body});
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	onToggleAnon() {
		this.setState(prevState => ({"publishAnon": !prevState.publishAnon}));
	}

	onPublish( e ) {
		// MK: Uses state
		if ( this.canSave() ) {
			if ( this.state.publishAnon ) {
				if ( this.props.onpublish ) {
					this.props.onpublish(e, true);
				}
			}
			else {
				if ( this.props.onpublish ) {
					this.props.onpublish(e);

					//this.setState({'modified': false, 'editing': true, 'preview': false});
				}
			}
		}
	}

	onEdit( e ) {
		this.setState({'editing': true, 'preview': false});
	}

	onLove( e ) {
		// MK: uses state
		if ( (this.props.user.id != 0) && (this.props.user.id != null) ) {
			if ( this.props.comment.id != null ) {
				if ( this.state.loved ) {
					$CommentLove.Remove(this.props.comment.node, this.props.comment.id)
					.then(r => {
						if ( r.removed != 0 ) {
							this.setState({'loved': false, 'lovecount': this.state.lovecount - 1});
						}
					});
				}
				else {
					$CommentLove.Add(this.props.comment.node, this.props.comment.id)
					.then(r => {
						if ( r.id != 0 ) {
							this.setState({'loved': true, 'lovecount': this.state.lovecount + 1});
						}
					});
				}
			}
		}
	}

	onReply( e ) {
		//console.log('reply');
	}

	onSubscribe( e ) {
		// consider disabling element temporarily. But this should go by quickly
		if ( this.props.onsubscribe ) {
			this.props.onsubscribe(e, this.props.cansubscribe);
		}
	}

	onAutocompleteSelect(replaceText, cursorPosAfterUpdate) {
		this.props.comment.body = replaceText;
		this.setState(prevState => ({
			'modified': this.canSave(),
			'editText': replaceText,
			'replaceText': replaceText,
			'replaceCursorPos': cursorPosAfterUpdate,
			'replaceTextEvent': prevState.replaceTextEvent ? prevState.replaceTextEvent + 1 : 1,
		}));
	}

	onAutoselectCaptureKeyDown(autocompleter, callback) {
		const {autocompleters} = this;
		if ( !autocompleters[autocompleter] ) {
			autocompleters[autocompleter] = {};
		}
		autocompleters[autocompleter].captureKeyDown = callback;
	}

	onAutoselectCaptureKeyUp(autocompleter, callback) {
		const {autocompleters} = this;
		if ( !autocompleters[autocompleter] ) {
			autocompleters[autocompleter] = {};
		}
		autocompleters[autocompleter].captureKeyUp = callback;
	}


	render( props, state ) {
		let {user, comment, author, error, node, isNodeAuthor, isMyComment, isMention} = props;

		// Allow authored comments, or non-authored (i.e. anonymous)
		if ( comment && (author || (comment.author == 0)) ) {
			let Name = "Anonymous";
			let Avatar = "///other/dummy/user64.png";

			// Only if authored
			if ( author ) {
				Name = author.name;

				if ( author.meta['real-name'] )
					Name = author.meta['real-name'];

				if ( author.meta['avatar'] )
					Avatar = author.meta['avatar'] + ".64x64.fit.png";
			}

			let ShowTitle = [];
			if ( !state.editing || state.preview ) {
				let Created = new Date(comment.created);
				let Modified = new Date(comment.modified);
				let Now = new Date();
				let DateDiff = (Now.getTime() - Created.getTime());
				let ModDiff = (Modified.getTime() - Created.getTime());

				// 1 minute leeway on edits
				let HasEdited = ModDiff > (60*1000);

				ShowTitle.push(
					<span>by <span class="-author">{Name}</span></span>
				);

				// Again, also only if authored
				if ( author ) {
					ShowTitle.push(
						<span>&nbsp;(<NavLink class="-atname" href={"/users/"+author.slug}>{"@"+author.slug}</NavLink>){comment.anonymous ? " (Published Anonymously)" : ""}</span>
					);
				}

				if ( comment.created ) {
					ShowTitle.push(
						<span>, <span title={comment.id}>published</span> <span class="-date" title={getLocaleTimeStamp(Created)}>{getRoughAge(DateDiff)}</span><span title={getLocaleDate(Modified)}>{HasEdited?" (edited)":""}</span></span>
					);
				}
				else {
					ShowTitle.push(<span>, not yet published</span>);
				}
			}

			let ShowReply = null;
			//if ( user && user.id )
			//	ShowReply = <div class="-button -reply" onClick={this.onReply}><UIIcon>reply</UIIcon><div>Reply</div></div>;

			let ShowEdit = null;
			if ( user && comment && (comment.author > 0) && (comment.author === user.id) && !state.editing )
				ShowEdit = <div class="-button -edit" onClick={this.onEdit}><UIIcon>edit</UIIcon></div>;

			let ShowLove = null;
			if ( !props.nolove ) {
				ShowLove = (
					<div class={"-button -love"+(state.loved?" -loved":"")} onClick={this.onLove}>
						<UIIcon class="-hover-hide">heart</UIIcon>
						<UIIcon class="-hover-show -loved-hide">heart-plus</UIIcon>
						<UIIcon class="-hover-show -loved-show">heart-minus</UIIcon>
						<div>{Number.isInteger(state.lovecount) ? state.lovecount : comment.love}</div>
					</div>
				);
			}

			let ShowBottomNav = null;
			//if ( !state.editing )
			{
				ShowBottomNav = (
					<div class="-nav">
						<div class="-right">
							{ShowLove}
							{ShowEdit}
						</div>

						<div class="-left">{ShowReply}</div>
					</div>
				);
			}

			let ShowTopNav = null;
			if ( state.editing ) {
				let ShowLeft = [];
				if ( !state.preview ) {
					ShowLeft = [
						<div class="-button -preview" onClick={this.onPreview}><UIIcon>preview</UIIcon><div class="if-sidebar-block">Preview</div></div>,
						<div class="-button -editing -selected"><UIIcon>edit</UIIcon><div class="if-sidebar-block">Edit</div></div>,
					];
				}
				else {
					ShowLeft = [
						<div class="-button -preview -selected"><UIIcon>preview</UIIcon><div class="if-sidebar-block">Preview</div></div>,
						<div class="-button -editing" onClick={this.onEditing}><UIIcon>edit</UIIcon><div class="if-sidebar-block">Edit</div></div>,
					];
				}

				let ShowRight = [];

				ShowRight.push(<UICheckbox onClick={this.onSubscribe} value={props.subscribed} tooltip="You always receive notifications for mentions">Receive notifications</UICheckbox>);

				if ( props.publish ) {
					if ( props.allowAnonymous ) {
						ShowRight.push(<UICheckbox onClick={this.onToggleAnon} value={state.publishAnon} tooltip="NOTE: Your identity is always available to the administrators.">Anonymous</UICheckbox>);
					}
					ShowRight.push(<div class={"-button -publish"+(state.modified?" -modified":"")} onClick={this.onPublish}><UIIcon>publish</UIIcon><div>Publish</div></div>);
				}
				else {
					ShowRight.push(<div class="-button -cancel" onClick={this.onCancel}><UIIcon>cross</UIIcon><div class="if-sidebar-block">Cancel</div></div>);
					ShowRight.push(<div class={"-button -save"+(state.modified?" -modified":"")} onClick={this.onSave}><UIIcon>save</UIIcon><div>Save</div></div>);
				}

				ShowTopNav = (
					<div class="-nav">
						<div class="-right">{ShowRight}</div>
						<div class="-left">{ShowLeft}</div>
					</div>
				);
			}

			let ShowError = null;
			if ( error ) {
				ShowError = (
					<div class="-error">{"Failed to post comment: " + error}</div>
				);
			}

			let ShowAvatar = null;
			if ( author ) {
				ShowAvatar = <ButtonLink class="-avatar" href={author.path}><UIImage alt={author.slug + "'s avatar image"} src={Avatar} /></ButtonLink>;
			}
			else {
				ShowAvatar = <div class="-avatar"><UIImage src={Avatar} /></div>;
			}

			const ShowAutocompleteAt = <AutocompleteAtNames
				text={state.editText}
				cursorPos={state.editCursorPos}
				authors={props.authors}
				textareaFocus={state.textareaFocus}
				onSelect={this.onAutocompleteSelect}
				captureKeyDown={this.onAutoselectCaptureKeyDown}
				captureKeyUp={this.onAutoselectCaptureKeyUp}
			/>;
			const ShowAutocompleteEmoji = <AutocompleteEmojis
				text={state.editText}
				cursorPos={state.editCursorPos}
				textareaFocus={state.textareaFocus}
				onSelect={this.onAutocompleteSelect}
				captureKeyDown={this.onAutoselectCaptureKeyDown}
				captureKeyUp={this.onAutoselectCaptureKeyUp}
			/>;

			return (
				<div
					id={"comment-"+comment.id}
					class={cN(
						"-item", "-comment", "-indent-" + props.indent,
						isNodeAuthor && "comment-node-author",
						isMyComment && "comment-self-authored",
						isMention && "comment-mention"
					)}
				>
					{ShowAvatar}
					{ShowAutocompleteAt}
					{ShowAutocompleteEmoji}
					<div class="-body">
						{ShowTopNav}
						{ShowError}
						<div class="-text">
							<div class="-title">{ShowTitle}</div>
							<ContentCommentsMarkup
								user={user}
								node={node}
								editing={state.editing && !state.preview}
								onModify={this.onModify}
								onKeyDown={this.onKeyDown}
								onKeyUp={this.onKeyUp}
								onFocus={this.onTextAreaFocus}
								onBlur={this.onTextAreaBlur}
								oncaret={this.onTextAreaCaret}
								placeholder="type a comment here"
								limit={props.limit}
								replaceText={state.replaceText}
								cursorPos={state.replaceCursorPos}
								replaceTextEvent={state.replaceTextEvent}
							>
								{comment.body}
							</ContentCommentsMarkup>
						</div>
						{ShowBottomNav}
					</div>
					{props.children}
				</div>
			);
		}
		else {
			return (
				<div class={"-item -comment -indent-"+props.indent}>
					<div class="-body">There was a problem with this node</div>
				</div>
			);
		}
	}
}
