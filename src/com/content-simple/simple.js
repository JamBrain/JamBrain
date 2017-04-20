import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyBy				from 'com/content-common/common-body-by';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyMarkup			from 'com/content-common/common-body-markup';

import ContentCommonDraft				from 'com/content-common/common-draft';

import ContentCommonEdit				from 'com/content-common/common-edit';

import $Node							from '../../shrub/js/node/node';


export default class ContentSimple extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'author': {},

			'editing': this.isEditMode(),
			'modified': false,

			'name': props.node.name,
			'body': props.node.body,
		};

		if ( props.authored )
			this.getAuthor(props.node);

		this.onEdit = this.onEdit.bind(this);
		this.onPreview = this.onPreview.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onPublish = this.onPublish.bind(this);

		this.onModifyTitle = this.onModifyTitle.bind(this);
		this.onModifyText = this.onModifyText.bind(this);
	}

	componentWillUpdate( newProps, newState ) {
		if ( this.props.node !== newProps.node ) {
			if ( this.props.authored ) {
				this.getAuthor(newProps.node);
			}
		}
	}

	getAuthor( node ) {
		// Clear the Author
		this.setState({ author: {} });

		// Lookup the author
		$Node.Get( node.author )
		.then(r => {
			if ( r.node && r.node.length ) {
				this.setState({ 'author': r.node[0] });
			}
			else {
				this.setState({ 'error': "Author not found" });
			}
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

	onEdit( e ) {
		this.setState({'editing': true});
	}
	onPreview( e ) {
		this.setState({'editing': false});
	}
	onSave( e ) {
		var Title = this.state.name ? this.state.name : this.props.node.name;
		var Body = this.state.body ? this.state.body : this.props.node.body;
		
		return $Node.Update(this.props.node.id, Title, Body)
		.then(r => {
			if ( r.status == 200 ) {
				this.setState({ 'modified': false });
				return true;
			}
			else {
				if ( r.caller_id == 0 || (r.data && r.data.caller_id == 0) ) {
					location.hash = "#savebug";
				}
				else {
					this.setState({ 'error': r.status + ": " + r.error });
				}
			}
			return false;
		})
		.catch(err => {
			console.log(err);
			this.setState({ 'error': err });
		});
	}
	onPublish( e ) {
		// TODO: Confirm
		console.log('do save first');
		return this.onSave( e ).then( rr => {
			if ( rr ) {
				console.log('do publish');
				$Node.Publish(this.props.node.id)
				.then(r => {
					console.log(r);
					if ( r.status == 200 && r.path ) {
						window.location.href = r.path;
	//					this.setState({ 'modified': false });
					}
	//			else {
	//				if ( r.caller_id == 0 || (r.data && r.data.caller_id == 0) ) {
	//					location.hash = "#savebug";
	//				}
	//				else {
	//					this.setState({ 'error': r.status + ": " + r.error });
	//				}
	//			}
				})
				.catch(err => {
					console.log(err);
					this.setState({ 'error': err });
				});
			}
		});
	}

	onModifyTitle( e ) {
		this.setState({'modified': true, 'name': e.target.value});
	}
	onModifyText( e ) {
		this.setState({'modified': true, 'body': e.target.value});
	}
	
	isEditMode() {
		var extra = this.props.extra;
		return extra && extra.length && extra[extra.length-1] == 'edit';
	}
	
	render( props, state ) {
		props = Object.assign({}, props);	// Shallow copy we can change props

		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		
		var author = state.author;
	
		if ( node && ((node.slug && !props.authored) || (node.slug && author && author.slug)) ) {
			props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
			props.class.push("content-simple");

			var ShowEditBar = null;

			if ( this.isEditMode() ) {
				// Check if user has permission to edit
				if ( node.author !== user.id ) {	// might not be authored, so we check the node.author
					return <ContentError code="401">Permission Denied</ContentError>;
				}
				
				ShowEditBar = <ContentCommonEdit editing={state.editing} modified={state.modified} published={!!node.published} onedit={this.onEdit} onpreview={this.onPreview} onsave={this.onSave} onpublish={this.onPublish} />;
			}
			else {
				if ( user.id && (node.author === user.id) )
					props.edit = 1;
			}
			
			let ShowAvatar = null;
			let ShowByLine = null;
			if ( props.authored ) {
				ShowAvatar = <ContentCommonBodyAvatar src={author.meta && author.meta.avatar ? author.meta.avatar : ''} />;
				if ( props.by && !state.editing ) {
					ShowByLine = <ContentCommonBodyBy node={node} author={author} label="published" when />;
				}
			}
			else if ( props.updated && !state.editing ) {
				ShowByLine = <ContentCommonBodyBy node={node} label="Last updated" modified />;					
			}

			let ShowTitle = null;
			if ( !props.notitle ) {
				ShowTitle = <ContentCommonBodyTitle 
					href={path} 
					title={state.name} 
					titleIcon={props.titleIcon} 
					editing={state.editing} 
					onmodify={this.onModifyTitle} 
				/>;
			}
			
			let ShowMarkup = null;
			if ( !props.nomarkup ) {
				ShowMarkup = (
					<ContentCommonBodyMarkup 
						node={node} 
						editing={state.editing}
						placeholder="Say something"
						class="-block-if-not-minimized"
						onmodify={this.onModifyText}
					>
						{state.body}
					</ContentCommonBodyMarkup>
				);
			}
			
			let ShowAbove = null;
			if ( props.above ) {
				ShowAbove = props.above;
			}
			
			let ShowDraft = null;
			if ( !node.published ) {
				ShowDraft = <ContentCommonDraft />;
			}

			return (
				<ContentCommon {...props}>
					{ShowEditBar}
					{ShowDraft}
					{ShowAvatar}
					{ShowTitle}
					{ShowAbove}
					{ShowByLine}
					{ShowMarkup}
					{props.children}
				</ContentCommon>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
