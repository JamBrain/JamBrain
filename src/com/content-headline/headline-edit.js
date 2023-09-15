import { Component } from 'preact';
import './headline-edit.less';

import {Icon} from 'com/ui';
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
			ShowEdit = <ButtonBase class="-selected"><Icon>edit</Icon> Edit</ButtonBase>;
			ShowPreview = <ButtonBase onClick={onpreview}><Icon>preview</Icon> Preview</ButtonBase>;
		}
		else {
			ShowEdit = <ButtonBase onClick={onedit}><Icon>edit</Icon> Edit</ButtonBase>;
			ShowPreview = <ButtonBase class="-selected"><Icon>preview</Icon> Preview</ButtonBase>;
		}

		if ( modified ) {
			ShowSave = <ButtonBase class="-available -blue" onClick={onsave}><Icon>save</Icon> Save</ButtonBase>;
		}
		else {
			ShowSave = <ButtonBase><Icon>save</Icon> Saved</ButtonBase>;
		}

		if ( published ) {
			ShowPublish = <ButtonBase><Icon>publish</Icon> Published</ButtonBase>;
		}
		else {
			ShowPublish = [
				<ButtonBase class="-available -green" onClick={onpublish}><Icon>publish</Icon> Publish Compo</ButtonBase>,
				<ButtonBase class="-available -green" onClick={onpublish2}><Icon>publish</Icon> Publish Jam</ButtonBase>,
				<ButtonBase class="-available -green" onClick={onpublish3}><Icon>publish</Icon> Publish Extra</ButtonBase>
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
