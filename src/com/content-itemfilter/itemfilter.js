import {h, Component}					from 'preact/preact';

import UIIcon							from 'com/ui/icon/icon';
import UITagbox							from 'com/ui/tagbox/tagbox';
import UIText							from 'com/ui/text/text';
import UIDropdown						from 'com/ui/dropdown/dropdown';
import UIDropdownList					from 'com/ui/dropdown/dropdown-list';
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

			'event': 'featured',
			'events': [
				['featured', "Featured Event"],
				['all', "All Events"],
			],

			'category': 'all',
			'categories': [
				['all', "All"],
				['jam', "Jam"],
				['compo', "Compo"],
				['unfinished', "Unfinished"],
			],

			'order': 'smart',
			'orders': [
				['smart', "Smart"],
				['classic', "Classic"],
				['danger', "Danger"],
				['zero', "Zero"],
				['feedback', "Feedback"],
				['grade', "Grade"],

				['rel', "Relevence"],
				['alpha', "Alphabetical"],
				['pub', "Published"],
			],
		};

		this.onTagClick = this.onTagClick.bind(this);
		this.onTagAdd = this.onTagAdd.bind(this);

		this.onModifyQuery = this.onModifyQuery.bind(this);
		this.onModifyEvent = this.onModifyEvent.bind(this);
		this.onModifyCategory = this.onModifyCategory.bind(this);
		this.onModifyOrder = this.onModifyOrder.bind(this);
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
	onTagAdd( item ) {
		// Only allow add if we have an item
		if ( item ) {
			let mytags = this.state.mytags;

			for ( let idx = 0; idx < mytags.length; idx++ ) {
				if ( item.id == mytags[idx].id ) {
					this.setState({'query': ''});		// do nothing, except reset the query
					return;
				}
			}

			mytags.push(item);
			this.setState({'mytags': mytags, 'query': ''});
		}
	}

	onModifyQuery( e ) {
		this.setState({'query': e.target.value});
	}

	onModifyEvent( value, index ) {
		this.setState({'event': value});
	}

	onModifyCategory( value, index ) {
		this.setState({'category': value});
	}

	onModifyOrder( value, index ) {
		this.setState({'order': value});
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
						<UITextdown onmodify={this.onModifyQuery} onselect={this.onTagAdd} maxlength={128} value={state.query} placeholder={state.tags[state.randomtag].name} items={state.tags} />
					</div>
					<div class="-event">
						<div class="-title">Event:</div>
						<UIDropdownList onmodify={this.onModifyEvent} value={state.event} items={state.events} />
					</div>
					<div class="-category">
						<div class="-title">Category:</div>
						<UIDropdownList onmodify={this.onModifyCategory} value={state.category} items={state.categories} />
					</div>
					<div class="-order">
						<div class="-title">Order by:</div>
						<UIDropdownList onmodify={this.onModifyOrder} value={state.order} items={state.orders} />
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
