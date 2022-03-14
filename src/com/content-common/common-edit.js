import {h, Component} from 'preact';

import SVGIcon from 'com/svg-icon/icon';
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
			ShowEdit = <ButtonBase class="-selected"><SVGIcon>edit</SVGIcon><div class="if-sidebar-block">Edit</div></ButtonBase>;
			ShowPreview = <ButtonBase onClick={props.onpreview}><SVGIcon>preview</SVGIcon><div class="if-sidebar-block">Preview</div></ButtonBase>;
		}
		else {
			ShowEdit = <ButtonBase onClick={props.onedit}><SVGIcon>edit</SVGIcon><div class="if-sidebar-block">Edit</div></ButtonBase>;
			ShowPreview = <ButtonBase class="-selected"><SVGIcon>preview</SVGIcon><div class="if-sidebar-block">Preview</div></ButtonBase>;
		}

		if ( props.modified ) {
			ShowSave = <ButtonBase class="-available -save" onClick={props.onsave}><SVGIcon>save</SVGIcon><div class="if-sidebar-block">Save</div></ButtonBase>;
		}
		else {
			ShowSave = <ButtonBase><SVGIcon>save</SVGIcon><div class="if-sidebar-block">Saved</div></ButtonBase>;
		}

		if ( !props.nopublish ) {
			if ( !props.published ) {
				ShowPublish = <ButtonBase class="-available -publish" onClick={props.onpublish}><SVGIcon>publish</SVGIcon><div class="if-sidebar-block">Publish</div></ButtonBase>;
			}
			else {
				ShowPublish = <ButtonBase class="-available -publish" onClick={props.ondone}><SVGIcon>checkmark</SVGIcon><div class="if-sidebar-block">Done</div></ButtonBase>;
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
