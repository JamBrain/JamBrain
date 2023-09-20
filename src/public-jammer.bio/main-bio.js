import { render, Component } from 'preact';
import ContentPost from 'com/content-post/post';

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
			<main>
				<div id="content">{
					state.posts.map((e) => {
						return <ContentPost title={e} />;
					})
				}</div>
			</main>
		);
	}
};

render(<Main />, document.body);
