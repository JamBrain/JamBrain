import {h, Component}					from 'preact/preact';
import UITagbox							from 'com/ui/tagbox/tagbox';

export default class ItemFilter extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'tags': [],
		};

		this.onTagClick = this.onTagClick.bind(this);
	}

	componentDidMount() {
		this.setState({'tags': [
			{
				'id': 44,
				'slug': "frog",
				'name': "Frog",
			},
			{
				'id': 45,
				'slug': "dog-waffle",
				'name': "Dog Waffle",
			},
			{
				'id': 46,
				'slug': "towel",
				'name': "Towel",
			},
		]});
	}

	onTagClick( index ) {
		let tags = this.state.tags.slice();		// copy
		tags.splice(index, 1);					// remove
		this.setState({'tags': tags});
	}

	render( props, state ) {

		return (
			<div class="content-base content-common content-itemfilter">
				<div class="-body">
					<UITagbox tags={state.tags} onclick={this.onTagClick} />
				</div>
			</div>
		);
	}
}
