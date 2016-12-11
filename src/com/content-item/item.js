import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

import ContentBody						from 'com/content-body/body';
import ContentBodyMarkup				from 'com/content-body-markup/body-markup';
import ContentBodyEdit					from 'com/content-body-edit/body-edit';

import ContentHeaderCommon				from 'com/content-header-common/header-common';
import ContentFooterCommon				from 'com/content-footer-common/footer-common';
import ContentHeaderEdit				from 'com/content-header-edit/header-edit';
import ContentFooterEdit				from 'com/content-footer-edit/footer-edit';

import ContentHeadlineEdit				from 'com/content-headline-edit/headline-edit';

import $Node							from '../../shrub/js/node/node';

export default class ContentItem extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'edit': true,
			'modified': false,
			
			'authors': null,
			
			'title': null,
			'body': null
		};

		this.onClickEdit = this.onClickEdit.bind(this);
		this.onClickPreview = this.onClickPreview.bind(this);
		this.onClickSave = this.onClickSave.bind(this);
		this.onClickPublish = this.onClickPublish.bind(this);
		
		this.onModifyTitle = this.onModifyTitle.bind(this);
		this.onModifyBody = this.onModifyBody.bind(this);
	}
	
	componentDidMount() {
		$Node.Get(this.props.node.author)
		.then( r => {
			console.log(r.node);
			if ( r.node.length ) {
				console.log('hoo');
				this.setState({ 'authors': r.node });
			}
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}
	
	onClickEdit(e) {
		console.log('edit');
		this.setState({ 'edit': true });
	}
	onClickPreview(e) {
		console.log('prev');
		this.setState({ 'edit': false });
	}
	onClickSave(e) {
		console.log('save');
		
		var Title = this.state.title ? this.state.title : this.props.node.name;
		var Body = this.state.body ? this.state.body : this.props.node.body;
		
		$Node.Update(this.props.node.id, Title, Body)
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
	onClickPublish(e) {
		console.log('pub');
		// DO THING UPDATE NODE
		
		this.setState({ 'error': 'I hate birds' });
	}
	
	onModifyTitle( e ) {
		this.setState({ 'modified': true, 'title': e.srcElement.value });
	}
	onModifyBody( e ) {
		this.setState({ 'modified': true, 'body': e.srcElement.value });
	}
	
	
	
	render( {node, user, path, extra}, {edit, modified, authors, title, body, error} ) {
		var EditMode = false;
		
		var ShowError = null;

		var ShowEditBar = null;
		var ShowItem = null;
		
		if ( error ) {
			ShowError = <div class="-error"><strong>Error</strong>: {error}</div>;
		}

		// Hack Edit mode only if you're the author
		if ( user && user.id == node.author ) {
			var EditMode = extra.length ? extra[0] === 'edit' : false;
			
			var IsPublished = node.published === '0000-00-00T00:00:00Z';
	
			if ( EditMode ) {
				ShowEditBar = <ContentHeadlineEdit edit={edit} modified={modified} published={IsPublished} onedit={this.onClickEdit} onpreview={this.onClickPreview} onsave={this.onClickSave} onpublish={this.onClickPublish} />;
			}
		}

		if ( EditMode && edit ) {
			ShowItem = (
				<div class="content-base content-common content-item">
					<ContentHeaderEdit title={title ? title : node.name} onmodify={this.onModifyTitle} author={authors} />
					<ContentBodyEdit onmodify={this.onModifyBody}>{body ? body : node.body}</ContentBodyEdit>
					<ContentFooterEdit node={node} user={user} love />
				</div>
			);
		}
		else {
			ShowItem = (
				<div class="content-base content-common content-item">
					<ContentHeaderCommon title={title ? title : node.name} path={path} />
					<ContentBodyMarkup>{body ? body : node.body}</ContentBodyMarkup>
					<ContentFooterCommon node={node} user={user} love />
				</div>
			);
		}
		
		if ( EditMode ) {
			return <div>{ShowEditBar}{ShowError}{ShowItem}</div>;
		}
		else {
			return <div>{ShowItem}</div>;
		}
	}
}
