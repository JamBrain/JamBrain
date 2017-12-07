import {h, Component}					from 'preact/preact';
import UIIcon							from 'com/ui/icon/icon';
import UITagbox							from 'com/ui/tagbox/tagbox';
import UIText							from 'com/ui/text/text';
import UIDropdown						from 'com/ui/dropdown/dropdown';
import UITextdown						from 'com/ui/textdown/textdown';

import $Tag								from 'shrub/js/tag/tag';

export default class ItemFilter extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'query': "",
			'tags': null,
			'randomtag': null,
			'mytags': [],
		};

		this.onTagClick = this.onTagClick.bind(this);
		this.onModifyQuery = this.onModifyQuery.bind(this);
	}

	componentDidMount() {
		$Tag.Get('platform')
		.then(r => {
			if ( r && r.tag ) {
				this.setState({'tags': r.tag, 'randomtag': Math.floor(Math.random()*r.tag.length)});
			}
		});
	}

	onTagClick( index ) {
		let mytags = this.state.mytags.slice();		// copy
		mytags.splice(index, 1);					// remove
		this.setState({'mytags': mytags});
	}

	onModifyQuery( e ) {
		this.setState({'query': e.target.value});
	}

	render( props, state ) {
		if ( !state.tags )
			return null;

		let ShowFilters = null;
		if ( state.mytags && state.mytags.length )
			ShowFilters = <UITagbox tags={state.mytags} onclick={this.onTagClick} />;
		else
			ShowFilters = <div>None</div>;

		return (
			<div class="content-base content-common content-itemfilter">
				<div class="-header"></div>
				<div class="-body -flex">
					<div class="-query">
						<div class="-title">Platform/Tag:</div>
						<UITextdown onmodify={this.onModifyQuery} maxlength={128} value={state.query} placeholder={state.tags[state.randomtag].name} items={state.tags} />
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
