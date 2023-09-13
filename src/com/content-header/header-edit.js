import {h, Component, toChildArray} 	from 'preact';
import {Diff}	 				from 'shallow';

export default class ContentHeaderEdit extends Component {
	constructor( props ) {
		super(props);
	}

	// MK: This normally checks children. Is this correct?
	shouldComponentUpdate( nextProps ) {
		return Diff(this.props, nextProps);
	}

	render( {title, authors, link, published, onModify}, {} ) {
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
				<input type="text" value={title} onInput={onModify} placeholder="Titles can use **bold** markup" />
				{ShowAuthors}
				{ShowLink}
			</div>
		);
	}
}
