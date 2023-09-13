import { render, Component } from 'preact';
import ContentPost						from 'com/content-post/post';

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'posts': "jammer bio"
		};
	}

	componentDidMount() {
		// Startup //
	}

	render( props, state ) {
		return (
			<div id="layout-page">
				<div id="content">{
					state.posts.map(function(e) {
						return <ContentPost title={e} />;
					})
				}</div>
			</div>
		);
	}
};

render(<Main />, document.body);
