import { h, Component } 				from 'preact/preact';
import {shallowDiff}	 				from 'shallow-compare/index';

export default class ContentHeaderEdit extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props, nextProps);
	}

	render( {title, authors, link, published, onmodify}, {} ) {
		//console.log('here', authors);
		var ShowAuthors = null;
		if ( authors ) {
			ShowAuthors = authors.map( v => {
				<div class="-author">{v.name}</div>;
			});

			ShowAuthors.unshift(<div class="-label">Authors:</div>);
		}

		var ShowLink = null;
		if ( link ) {
			ShowLink = [
				<div class="-label">Link:</div>,
				<div>{link}{published ? "" : " (unpublished)"}</div>
			];
		}


		return (
			<div class="content-header content-header-common content-header-edit">
				<div class="-label">Title:</div>
				<input type="text" value={title} oninput={onmodify} placeholder="Titles can use **bold** markup" />
				{ShowAuthors}
				{ShowLink}
			</div>
		);
	}
}
