import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';
import IMG2								from 'com/img2/img2';

export default class ContentBox extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'authors': null
		};
	}

	getAuthors() {
		
	}

	render( props, state ) {
		props = Object.assign({}, props);

		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;

		if ( node /* && state.authors */ ) {
			var Class = ["content-box"];

			var Title = node.name;
			
			var CoverFail = '///content/internal/tvfail.png';
			var Cover = (node.meta && node.meta.cover) ? node.meta.cover : CoverFail;

			Cover += '.320x256.fit.jpg';

			//href={node.path}
			return (
				<div class={cN(Class, props.class)}>
					<IMG2 class="-view" src={Cover} failsrc={CoverFail} />
					<div class="-event">
						<div>JAM</div>
					</div>
					<div class="-bar">
						<div class="-title">{Title}</div>
					</div>
				</div>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
