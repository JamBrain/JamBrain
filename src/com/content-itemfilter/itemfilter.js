import {h, Component}					from 'preact/preact';
import UIIcon							from 'com/ui/icon/icon';
import UITagbox							from 'com/ui/tagbox/tagbox';
import UIText							from 'com/ui/text/text';
import UIDropdown						from 'com/ui/dropdown/dropdown';

export default class ItemFilter extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'query': "",
			'tags': [],
		};

		this.onTagClick = this.onTagClick.bind(this);
		this.onModifyQuery = this.onModifyQuery.bind(this);
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

	onModifyQuery( e ) {
		this.setState({'query': e.target.value});
	}

	render( props, state ) {

		let ShowFilters = null;;
		if ( state.tags.length )
			ShowFilters = <UITagbox tags={state.tags} onclick={this.onTagClick} />;
		else
			ShowFilters = <div>None</div>;

		return (
			<div class="content-base content-common content-itemfilter">
				<div class="-header"></div>
				<div class="-body -flex">
					<div class="-query">
						<div class="-title">Platform/Tag:</div>
						<UIText onmodify={this.onModifyQuery} maxlength={64} value={state.query} />
					</div>
					<div class="-event">
						<div class="-title">Event:</div>
						<UIDropdown />
					</div>
					<div class="-category">
						<div class="-title">Category:</div>
						<UIDropdown />
					</div>
					<div class="-order">
						<div class="-title">Order by:</div>
						<UIDropdown />
					</div>
				</div>
				<div class="-body">
					<div class="-title">Filters:</div>
					{ShowFilters}
					<UIIcon>cog</UIIcon>
				</div>
				<div class="-footer">
				</div>
			</div>
		);
	}
}
