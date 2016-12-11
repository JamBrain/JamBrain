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
			
			'title': null,
			'body': null
		};

		this.onClickEdit = this.onClickEdit.bind(this);
		this.onClickPreview = this.onClickPreview.bind(this);
		this.onClickSave = this.onClickSave.bind(this);
		this.onClickPublish = this.onClickPublish.bind(this);
		
		this.onModifyBody = this.onModifyBody.bind(this);
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
		this.setState({ 'modified': false });
	}
	onClickPublish(e) {
		console.log('pub');
		// DO THING UPDATE NODE
	}
	
	onModifyBody( e ) {
		this.setState({ 'modified': true, 'body': e.srcElement.value });
	}
	
	render( {node, user, path, extra}, {edit, modified, body} ) {
		var EditMode = false;

		var ShowEditBar = null;
		var ShowItem = null;

		// Hack Edit mode only if you're the author
		if ( user && user.id == node.author ) {
			var EditMode = extra.length ? extra[0] === 'edit' : false;
			
			var IsPublished = node.published !== '0000-00-00T00:00:00Z';
	
			if ( EditMode ) {
				ShowEditBar = <ContentHeadlineEdit edit={edit} modified={modified} published={IsPublished} onedit={this.onClickEdit} onpreview={this.onClickPreview} onsave={this.onClickSave} onpublish={this.onClickPublish} />;
			}
		}

		if ( EditMode && edit ) {
			ShowItem = (
				<div class="content-base content-common content-item">
					<ContentHeaderEdit title={node.name} author={node} />
					<ContentBodyEdit onmodify={this.onModifyBody}>{body ? body : node.body}</ContentBodyEdit>
					<ContentFooterEdit node={node} user={user} love />
				</div>
			);
		}
		else {
			ShowItem = (
				<div class="content-base content-common content-item">
					<ContentHeaderCommon title={node.name} author={node} />
					<ContentBodyMarkup>{body ? body : node.body}</ContentBodyMarkup>
					<ContentFooterCommon node={node} user={user} love />
				</div>
			);
		}
		
		if ( EditMode ) {
			return <div>{ShowEditBar}{ShowItem}</div>;
		}
		else {
			return <div>{ShowItem}</div>;
		}
	}
}
