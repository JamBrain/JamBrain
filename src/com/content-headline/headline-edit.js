import { Component } from 'preact';
import './headline-edit.less';

import {UIIcon} from 'com/ui';
import ButtonBase from 'com/button-base/base';


export default class ContentHeadlineEdit extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return this.props.edit !== nextProps.edit ||
			this.props.modified !== nextProps.modified ||
			this.props.published !== nextProps.published;
	}

	render( {edit, modified, published, onedit, onpreview, onsave, onpublish, onpublish2, onpublish3}, state ) {
		var ShowEdit = null;
		var ShowPreview = null;
		var ShowSave = null;
		var ShowPublish = null;

		if ( edit ) {
			ShowEdit = <ButtonBase class="-selected"><UIIcon>edit</UIIcon> Edit</ButtonBase>;
			ShowPreview = <ButtonBase onClick={onpreview}><UIIcon>preview</UIIcon> Preview</ButtonBase>;
		}
		else {
			ShowEdit = <ButtonBase onClick={onedit}><UIIcon>edit</UIIcon> Edit</ButtonBase>;
			ShowPreview = <ButtonBase class="-selected"><UIIcon>preview</UIIcon> Preview</ButtonBase>;
		}

		if ( modified ) {
			ShowSave = <ButtonBase class="-available -blue" onClick={onsave}><UIIcon>save</UIIcon> Save</ButtonBase>;
		}
		else {
			ShowSave = <ButtonBase><UIIcon>save</UIIcon> Saved</ButtonBase>;
		}

		if ( published ) {
			ShowPublish = <ButtonBase><UIIcon>publish</UIIcon> Published</ButtonBase>;
		}
		else {
			ShowPublish = [
				<ButtonBase class="-available -green" onClick={onpublish}><UIIcon>publish</UIIcon> Publish Compo</ButtonBase>,
				<ButtonBase class="-available -green" onClick={onpublish2}><UIIcon>publish</UIIcon> Publish Jam</ButtonBase>,
				<ButtonBase class="-available -green" onClick={onpublish3}><UIIcon>publish</UIIcon> Publish Extra</ButtonBase>
			];
		}

		return (
			<div class="content-headline content-headline-edit">
				<div class="-left">
					{ShowEdit}
					{ShowPreview}
				</div>
				<div class="-right">
					{ShowSave}
					{ShowPublish}
				</div>
			</div>
		);
	}
}
