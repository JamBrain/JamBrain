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


const HelpItemSearch = [
	<p>Start typing platform names, genres, and other details. A list of choices will appear below. Push <strong>ENTER</strong> to add the item.</p>,
];

const HelpItemEvent = [
	<p><strong>Featured Event:</strong> Items from the currently active event.</p>,
	<p><strong>All Events:</strong> Items from all events.</p>,
];

const HelpItemCategory = [
	<p><strong>Jam:</strong> Things created for the 72 hour <strong>Jam</strong> event.</p>,
	<p><strong>Compo:</strong> Things created for the 48 hour <strong>Compo</strong> event.</p>,
	<p><strong>Craft:</strong> Things created for the <strong>Craft</strong> event, or things impractical to rate by normal means.</p>,
	<p><strong>Unfinished:</strong> Unfinished things from any event.</p>,
	<p><strong>Warmup:</strong> Things created in preparation for an event.</p>,
	<p><strong>Release:</strong> Things created after the event, based on something created for the event.</p>,
];

const HelpItemOrder = [
	<p><strong>Smart</strong>: This is the modern balancing filter. It balances the list using a combination of votes and the karma given to feedback. You start seeing diminishing returns after 50 ratings, but you can make up for it by leaving quality feedback.</p>,
	<p><strong>Unbound</strong>: This is a variation of the Smart filter that is unbound. For curiousity.</p>,
	<p><strong>Classic</strong>: This is the classic balancing filter. It balances the list based on ratings alone. You start seeing diminishing returns after 100 ratings.</p>,
	<p><strong>Danger</strong>: This is the rescue filter. Everything with less than 20 ratings sorted top to bottom. Items on the first page are typically 1-2 rating away, so help them out!</p>,
	<p><strong>Zero</strong>: This filter shows the most neglected games. These are often new users that didn't understand you should rate games. Leaving them some feedback is greatly appreciated.</p>,
	<p><strong>Feedback</strong>: This filter lets you find who is working the hardest, leaving quality feedback for others.</p>,
	<p><strong>Grade</strong>: This filter lets you find the games that have the most ratings.</p>,
];
//'


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
				['featured', [<UIIcon src="calendar-event" />, <span>Featured Event</span>]],
				['all', [<UIIcon src="calendar-wide" />, <span>All Events</span>]],
			],

			'category': 'all',
			'categories': [
				['all', [<UIIcon src="trophys" />, <span>Jam+Compo</span>]],
				['jam', [<UIIcon src="trophy" />, <span>Jam</span>]],
				['compo', [<UIIcon src="trophy" />, <span>Compo</span>]],
//				['craft', [<UIIcon src="craft" />, <span>Craft</span>]],
				['unfinished', [<UIIcon src="trash" />, <span>Unfinished</span>]],
				['warmup', [<UIIcon src="science" />, <span>Warmup</span>]],
//				['release', [<UIIcon src="publish" />, <span>Release</span>]],
			],

			'order': 'smart',
			'orders': [
//				[null, <span>Standard</span>],
//				['rel', [<UIIcon src="checkmark" />, <span>Relevence</span>]],

//				['pub', [<UIIcon src="publish" />, <span>Publish Date</span>]],
//				['az-asc', [<UIIcon src="sort-amount-asc" />, <span>Ascending A-Z</span>]],
//				['az-desc', [<UIIcon src="sort-amount-desc" />, <span>Descending Z-A</span>]],

				[null, <span>Event Specific</span>],
				['smart', [<UIIcon src="meter" />, <span>Smart</span>]],
				['classic', [<UIIcon src="meter" />, <span>Classic</span>]],
				['danger', [<UIIcon src="help" />, <span>Danger</span>]],
				['zero', [<UIIcon src="no" />, <span>Zero</span>]],
				['feedback', [<UIIcon src="bubbles" />, <span>Feedback</span>]],
				['grade', [<UIIcon src="todo" />, <span>Grade</span>]],
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

		return (
			<div class="content-base content-common content-itemfilter">
				<div class="-header"></div>
				<div class="-body -flex">
					<div class="-query">
						<div class="-title"><UIHelp>{HelpItemSearch}</UIHelp>Platform/Tag filters:</div>
						<UITextdown onmodify={this.onModifyQuery} onselect={this.onTagAdd} maxlength={128} value={state.query} placeholder={state.tags[state.randomtag].name} items={state.tags} />
					</div>
					<div class="-event">
						<div class="-title"><UIHelp>{HelpItemEvent}</UIHelp><span>Event:</span></div>
						<UIDropdownList onmodify={this.onModifyEvent} value={state.event} items={state.events} right />
					</div>
					<div class="-category">
						<div class="-title"><UIHelp>{HelpItemCategory}</UIHelp>Category:</div>
						<UIDropdownList onmodify={this.onModifyCategory} value={state.category} items={state.categories} right />
					</div>
					<div class="-order">
						<div class="-title"><UIHelp>{HelpItemOrder}</UIHelp>Order by:</div>
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
