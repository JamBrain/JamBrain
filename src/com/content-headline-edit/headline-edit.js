import { h, Component } 				from 'preact/preact';

import SVGIcon 							from 'com/svg-icon/icon';

import ButtonBase 						from 'com/button-base/base';


export default class ContentHeadlineEdit extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return this.props.edit !== nextProps.edit ||
			this.props.modified !== nextProps.modified ||
			this.props.published !== nextProps.published;
	}

	render( {edit, modified, published, onedit, onpreview, onsave, onpublish}, state ) {
		var ShowEdit = null;
		var ShowPreview = null;
		var ShowSave = null;
		var ShowPublish = null;
		
		if ( edit ) {
			ShowEdit = <ButtonBase class="-selected"><SVGIcon>edit</SVGIcon> Edit</ButtonBase>;
			ShowPreview = <ButtonBase onclick={onpreview}><SVGIcon>preview</SVGIcon> Preview</ButtonBase>;
		}
		else {
			ShowEdit = <ButtonBase onclick={onedit}><SVGIcon>edit</SVGIcon> Edit</ButtonBase>;
			ShowPreview = <ButtonBase class="-selected"><SVGIcon>preview</SVGIcon> Preview</ButtonBase>;
		}

		if ( modified ) {
			ShowSave = <ButtonBase class="-available -red" onclick={onsave}><SVGIcon>save</SVGIcon> Save</ButtonBase>;
		}
		else {
			ShowSave = <ButtonBase><SVGIcon>save</SVGIcon> Saved</ButtonBase>;
		}

		if ( published ) {
			ShowPublish = <ButtonBase><SVGIcon>publish</SVGIcon> Published</ButtonBase>;
		}
		else {
			ShowPublish = <ButtonBase class="-available -green" onclick={onpublish}><SVGIcon>publish</SVGIcon> Publish</ButtonBase>;
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
