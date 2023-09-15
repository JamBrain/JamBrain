import {Component} from 'preact';
import './common-edit.less';

import {Icon} from 'com/ui';
import ButtonBase from 'com/button-base/base';


export default class ContentCommonEdit extends Component {
	constructor( props ) {
		super(props);
	}

//	shouldComponentUpdate( nextProps ) {
//		return this.props.edit !== nextProps.edit ||
//			this.props.modified !== nextProps.modified ||
//			this.props.published !== nextProps.published;
//	}

	render( props ) {
		var ShowEdit = null;
		var ShowPreview = null;
		var ShowSave = null;
		var ShowPublish = null;

		if ( props.editing ) {
			ShowEdit = <ButtonBase class="-selected"><Icon>edit</Icon><div class="if-sidebar-block">Edit</div></ButtonBase>;
			ShowPreview = <ButtonBase onClick={props.onpreview}><Icon>preview</Icon><div class="if-sidebar-block">Preview</div></ButtonBase>;
		}
		else {
			ShowEdit = <ButtonBase onClick={props.onedit}><Icon>edit</Icon><div class="if-sidebar-block">Edit</div></ButtonBase>;
			ShowPreview = <ButtonBase class="-selected"><Icon>preview</Icon><div class="if-sidebar-block">Preview</div></ButtonBase>;
		}

		if ( props.modified ) {
			ShowSave = <ButtonBase class="-available -save" onClick={props.onsave}><Icon>save</Icon><div class="if-sidebar-block">Save</div></ButtonBase>;
		}
		else {
			ShowSave = <ButtonBase><Icon>save</Icon><div class="if-sidebar-block">Saved</div></ButtonBase>;
		}

		if ( !props.nopublish ) {
			if ( !props.published ) {
				ShowPublish = <ButtonBase class="-available -publish" onClick={props.onpublish}><Icon>publish</Icon><div class="if-sidebar-block">Publish</div></ButtonBase>;
			}
			else {
				ShowPublish = <ButtonBase class="-available -publish" onClick={props.ondone}><Icon>checkmark</Icon><div class="if-sidebar-block">Done</div></ButtonBase>;
			}
			// Otherwise, published is null, so publish button is not shown
		}

		return (
			<div class="body -edit">
				<div class="-right">
					{ShowSave}
					{ShowPublish}
				</div>
				<div class="-left">
					{ShowPreview}
					{ShowEdit}
				</div>
			</div>
		);
	}
}
