import {h, Component}					from 'preact/preact';

import UIIcon							from 'com/ui/icon/icon';
import UIButton							from 'com/ui/button/button';
import UITagbox							from 'com/ui/tagbox/tagbox';
import UIText							from 'com/ui/text/text';
import UIDropdown						from 'com/ui/dropdown/dropdown';
import UIDropdownList					from 'com/ui/dropdown/dropdown-list';
import UITextdown						from 'com/ui/textdown/textdown';

import UIHelp							from 'com/ui/help/help';

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
				['featured', [<UIIcon src="tag" />, <span>Featured Event</span>]],
				['all', [<UIIcon src="tags" />, <span>All Events</span>]],
			],

			'category': 'all',
			'categories': [
				['all', [<UIIcon src="gamepad" />, <span>All</span>]],
				['jam', [<UIIcon src="trophy" />, <span>Jam</span>]],
				['compo', [<UIIcon src="trophy" />, <span>Compo</span>]],
				['unfinished', [<UIIcon src="trash" />, <span>Unfinished</span>]],
			],

			'order': 'smart',
			'orders': [
				['smart', [<UIIcon src="ticket" />, <span>Smart</span>]],
				['classic', [<UIIcon src="ticket" />, <span>Classic</span>]],
				['danger', [<UIIcon src="help" />, <span>Danger</span>]],
				['zero', [<UIIcon src="gift" />, <span>Zero</span>]],
				['feedback', [<UIIcon src="bubbles" />, <span>Feedback</span>]],
				['grade', [<UIIcon src="todo" />, <span>Grade</span>]],

//				['rel', [<UIIcon src="checkmark" />, <span>Relevence</span>]],
//				['alpha', [<UIIcon src="sort-amount-asc" />, <span>Alphabetical</span>]],
//				['pub', [<UIIcon src="publish" />, <span>Published</span>]],
			],

			'grid': 4,
		};

		this.onTagClick = this.onTagClick.bind(this);
		this.onTagAdd = this.onTagAdd.bind(this);

		this.onModifyQuery = this.onModifyQuery.bind(this);
		this.onModifyEvent = this.onModifyEvent.bind(this);
		this.onModifyCategory = this.onModifyCategory.bind(this);
		this.onModifyOrder = this.onModifyOrder.bind(this);

		//this.onModifyGrid = this.onModifyGrid.bind(this);
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

	onModifyGrid( value, index ) {
		console.log(value);
		this.setState({'grid': value});
	}

	render( props, state ) {
		if ( !state.tags )
			return null;

		let ShowFilters = null;
		if ( state.mytags && state.mytags.length )
			ShowFilters = <UITagbox tags={state.mytags} onclick={this.onTagClick} />;
		else
			ShowFilters = <div>None</div>;

		const HelpSearch = [
			<p>
				Start typing potential platform names, genres, or other details, and a list of choices will appear below.
				Push <strong>ENTER</strong> to add the highlighted item the filters below.
			</p>,
		];

		const HelpEvent = [
			<p>
				<strong>Featured Event:</strong> The currently active event that is going on right now.
			</p>,
			<p>
				<strong>All Events:</strong> The currently active event that is going on right now.
			</p>,
		];

		const HelpCategory = [
			<p>
				<strong>Fooo Event:</strong> The currently active event that is going on right now.
			</p>,
			<p>
				<strong>All Events:</strong> The currently active event that is going on right now.
			</p>,
		];

		const HelpOrder = [
			<p>
				<strong>Feee Event:</strong> The currently active event that is going on right now.
			</p>,
			<p>
				<strong>All Events:</strong> The currently active event that is going on right now.
			</p>,
		];


		return (
			<div class="content-base content-common content-itemfilter">
				<div class="-header"></div>
				<div class="-body -flex">
					<div class="-query">
						<div class="-title">Platform/Tag filters:<UIHelp>{HelpSearch}</UIHelp></div>
						<UITextdown onmodify={this.onModifyQuery} onselect={this.onTagAdd} maxlength={128} value={state.query} placeholder={state.tags[state.randomtag].name} items={state.tags} />
					</div>
					<div class="-event">
						<div class="-title"><span>Event:</span><UIHelp>{HelpEvent}</UIHelp></div>
						<UIDropdownList onmodify={this.onModifyEvent} value={state.event} items={state.events} right />
					</div>
					<div class="-category">
						<div class="-title">Category:<UIHelp>{HelpCategory}</UIHelp></div>
						<UIDropdownList onmodify={this.onModifyCategory} value={state.category} items={state.categories} right />
					</div>
					<div class="-order">
						<div class="-title">Order by:<UIHelp>{HelpOrder}</UIHelp></div>
						<UIDropdownList onmodify={this.onModifyOrder} value={state.order} items={state.orders} right />
					</div>
				</div>
				<div class="-body">
					<div class="-title">Filtering by:</div>
					{ShowFilters}
					<UIDropdown class="-grid" value={state.grid} right>
						<UIIcon src="grid" />
						<UIButton class="-item if-no-sidebar-block" onclick={this.onModifyGrid.bind(this, 1)}>1 Wide</UIButton>
						<UIButton class="-item if-no-sidebar-block" onclick={this.onModifyGrid.bind(this, 2)}>2 Wide</UIButton>
						<UIButton class="-item" onclick={this.onModifyGrid.bind(this, 3)}>3 Wide</UIButton>
						<UIButton class="-item" onclick={this.onModifyGrid.bind(this, 4)}>4 Wide</UIButton>
						<UIButton class="-item if-sidebar-block" onclick={this.onModifyGrid.bind(this, 5)}>5 Wide</UIButton>
						<UIButton class="-item if-sidebar-block" onclick={this.onModifyGrid.bind(this, 6)}>6 Wide</UIButton>
					</UIDropdown>
				</div>
				<div class="-footer">
				</div>
			</div>
		);
	}
}
