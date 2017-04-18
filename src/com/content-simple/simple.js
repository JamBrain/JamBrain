import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyBy				from 'com/content-common/common-body-by';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyMarkup			from 'com/content-common/common-body-markup';

import ContentCommonEdit				from 'com/content-common/common-edit';

import $Node							from '../../shrub/js/node/node';


export default class ContentSimple extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'author': {},

			'editing': this.isEditMode(),
			'modified': false,

			'body': props.node.body,
		};

		if ( props.authored )
			this.getAuthor(props.node);

		this.onEdit = this.onEdit.bind(this);
		this.onPreview = this.onPreview.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onPublish = this.onPublish.bind(this);

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
		//var Name = /*this.state.title ? this.state.title :*/ this.props.node.name;
		var Body = this.state.body ? this.state.body : this.props.node.body;
		
		return $Node.Update(this.props.node.id, null, Body)
		.then(r => {
			if ( r.status == 200 ) {
				this.setState({ 'modified': false });
			}
			else {
				if ( r.caller_id == 0 || (r.data && r.data.caller_id == 0) ) {
					location.hash = "#savebug";
				}
				else {
					this.setState({ 'error': r.status + ": " + r.error });
				}
			}
		})
		.catch(err => {
			console.log(err);
			this.setState({ 'error': err });
		});
	}
	onPublish( e ) {
		console.log( e );
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

			var EditBar = null;
			var IsPublished = false;

			if ( this.isEditMode() ) {
				// Check if user has permission to edit
				if ( node.author !== user.id ) {	// might not be authored, so we check the node.author
					return <ContentError code="401">Permission Denied</ContentError>;
				}
				
				// Hack
				//var IsPublished = node.type.length;//;Number.parseInt(node.published) !== 0;
				
				EditBar = <ContentCommonEdit editing={state.editing} modified={state.modified} published={IsPublished} onedit={this.onEdit} onpreview={this.onPreview} onsave={this.onSave} onpublish={this.onPublish} />;
			}
			else {
				if ( user.id && (author.id === user.id) )
					props.edit = 1;
			}
			
			let ShowAvatar = null;
			let ShowByLine = null;
			if ( props.authored ) {
				ShowAvatar = <ContentCommonBodyAvatar src={author.meta && author.meta.avatar ? author.meta.avatar : ''} />;
				if ( props.by ) {
					ShowByLine = <ContentCommonBodyBy node={node} author={author} label="published" when />;
				}
			}
			else if ( props.updated ) {
				ShowByLine = <ContentCommonBodyBy node={node} label="Last updated" modified />;					
			}

			return (
				<ContentCommon {...props}>
					{EditBar}
					{ShowAvatar}
					<ContentCommonBodyTitle href={path} title={node.name} />
					{ShowByLine}
					<ContentCommonBodyMarkup 
						node={node} 
						editing={state.editing}
						placeholder="Say something"
						class="-block-if-not-minimized"
						onmodify={this.onModifyText}
					>
						{state.body}
					</ContentCommonBodyMarkup>
					{props.children}
				</ContentCommon>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
