import { h, render, Component }		from 'preact/preact';
import NavBar 						from 'com/nav-bar/code';
import DarkOverlay					from 'com/dark-overlay/code';
import ContentPost					from 'com/content-post/post';

class Main extends Component {
	constructor() {
		this.state = {};
		this.state.posts = [ 
			"noof",
			"foof"
		];
	}
	
	render( props, state ) {
		return (
			<div id="layout">
				<NavBar />
				<div id="content">{
					state.posts.map(function(e) {
						return <ContentPost title={e} />;
					})
				}</div>
				<div id="sidebar">
				</div>
				<div id="footer">
				</div>
			</div>
		);
	}
};

render(<Main />, document.body);
