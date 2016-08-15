import { h, render, Component }			from 'preact/preact';
import DarkOverlay						from 'com/dark-overlay/overlay';
import ContentPost						from 'com/content-post/post';

class Main extends Component {
	constructor() {
		this.state = {};
		this.state.posts = [ 
			"jammer bio"
		];
	}
	
	componentDidMount() {
		// Startup //
	}
	
	render( props, state ) {
		return (
			<div id="layout">
				<div id="content">{
					state.posts.map(function(e) {
						return <ContentPost title={e} />;
					})
				}</div>
			</div>
		);
	}
};

//				<DarkOverlay />

render(<Main />, document.body);
