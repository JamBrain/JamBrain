import { Component } from 'preact';
import './headline-edit.less';

import {Icon, Button} from 'com/ui';


export default class ContentHeadlineEdit extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return this.props.edit !== nextProps.edit ||
			this.props.modified !== nextProps.modified ||
			this.props.published !== nextProps.published;
	}

	render( props ) {
		const {edit, modified, published, onedit, onpreview, onsave, onpublish, onpublish2, onpublish3, ...otherProps} = props;

		var ShowEdit = null;
		var ShowPreview = null;
		var ShowSave = null;
		var ShowPublish = null;

		if ( edit ) {
			ShowEdit = <Button class="-selected"><Icon src="edit" /> Edit</Button>;
			ShowPreview = <Button onClick={onpreview}><Icon src="preview" /> Preview</Button>;
		}
		else {
			ShowEdit = <Button onClick={onedit}><Icon src="edit" /> Edit</Button>;
			ShowPreview = <Button class="-selected"><Icon src="preview" /> Preview</Button>;
		}

		if ( modified ) {
			ShowSave = <Button class="-available -blue" onClick={onsave}><Icon src="save" /> Save</Button>;
		}
		else {
			ShowSave = <Button><Icon src="save" /> Saved</Button>;
		}

		if ( published ) {
			ShowPublish = <Button><Icon src="publish" /> Published</Button>;
		}
		else {
			ShowPublish = [
				<Button class="-available -green" onClick={onpublish}><Icon src="publish" /> Publish Compo</Button>,
				<Button class="-available -green" onClick={onpublish2}><Icon src="publish" /> Publish Jam</Button>,
				<Button class="-available -green" onClick={onpublish3}><Icon src="publish" /> Publish Extra</Button>
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
