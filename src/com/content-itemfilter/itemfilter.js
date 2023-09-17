import { Component } from 'preact';
import './itemfilter.less';


import {Icon, Button, Tagbox, TextField, Dropdown, UIDropdownList, DropdownText, Help} from 'com/ui';

import $Tag								from 'backend/js/tag/tag';


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
	<p><strong>Extra:</strong> Things created after the event.</p>,
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
				['featured', [<Icon src="calendar-event" />, <span>Featured Event</span>]],
				['all', [<Icon src="calendar-wide" />, <span>All Events</span>]],
			],

			'category': 'all',
			'categories': [
				['all', [<Icon src="trophys" />, <span>Jam+Compo+Extra</span>]],
				['jam', [<Icon src="trophy" />, <span>Jam</span>]],
				['compo', [<Icon src="trophy" />, <span>Compo</span>]],
//				['craft', [<UIIcon src="craft" />, <span>Craft</span>]],
				['extra', [<Icon src="trophy" />, <span>Extra</span>]],
				['unfinished', [<Icon src="trash" />, <span>Unfinished</span>]],
				['warmup', [<Icon src="science" />, <span>Warmup</span>]],
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
				['smart', [<Icon src="meter" />, <span>Smart</span>]],
				['classic', [<Icon src="meter" />, <span>Classic</span>]],
				['danger', [<Icon src="help" />, <span>Danger</span>]],
				['zero', [<Icon src="no" />, <span>Zero</span>]],
				['feedback', [<Icon src="bubbles" />, <span>Feedback</span>]],
				['grade', [<Icon src="todo" />, <span>Grade</span>]],
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
		this.setState(prevState => {
			let mytags = prevState.mytags.slice();		// copy
			mytags.splice(index, 1);					// remove
			return {'mytags': mytags};
		});
	}
	onTagAdd( item ) {
		// Only allow add if we have an item
		if ( item ) {
			// MK: Not a great solution, reading it here...
			let mytags = this.state.mytags;

			for ( let idx = 0; idx < mytags.length; idx++ ) {
				if ( item.id == mytags[idx].id ) {
					this.setState({'query': ''});		// do nothing, except reset the query
					return;
				}
			}

			// MK: ...then re-reading again here inside the callback
			this.setState(prevState => {
				let mytags = prevState.mytags;
				mytags.push(item);
				this.setState({'mytags': mytags, 'query': ''});
			});
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
		//console.log(value);
		this.setState({'grid': value});
	}

	render( props, state ) {
		if ( !state.tags )
			return null;

		let ShowFilters = null;
		if ( state.mytags && state.mytags.length )
			ShowFilters = <Tagbox tags={state.mytags} onClick={this.onTagClick} />;
		else
			ShowFilters = <div>None</div>;

		return (
			<div class="content -itemfilter">
				<div class="-header"></div>
				<div class="-body -flex">
					<div class="-query">
						<div class="-title"><Help>{HelpItemSearch}</Help>Platform/Tag filters:</div>
						<DropdownText onModify={this.onModifyQuery} onselect={this.onTagAdd} maxLength={128} value={state.query} placeholder={state.tags[state.randomtag].name} items={state.tags} />
					</div>
					<div class="-event">
						<div class="-title"><Help>{HelpItemEvent}</Help><span>Event:</span></div>
						<UIDropdownList onModify={this.onModifyEvent} value={state.event} items={state.events} right />
					</div>
					<div class="-category">
						<div class="-title"><Help>{HelpItemCategory}</Help>Category:</div>
						<UIDropdownList onModify={this.onModifyCategory} value={state.category} items={state.categories} right />
					</div>
					<div class="-order">
						<div class="-title"><Help>{HelpItemOrder}</Help>Order by:</div>
						<UIDropdownList onModify={this.onModifyOrder} value={state.order} items={state.orders} right />
					</div>
				</div>
				<div class="-body">
					<div class="-title">Filtering by:</div>
					{ShowFilters}
					<Dropdown class="-grid" value={state.grid} right>
						<Icon src="grid" />
						<Button class="-item if-no-sidebar-block" onClick={this.onModifyGrid.bind(this, 1)}>1 Wide</Button>
						<Button class="-item if-no-sidebar-block" onClick={this.onModifyGrid.bind(this, 2)}>2 Wide</Button>
						<Button class="-item" onClick={this.onModifyGrid.bind(this, 3)}>3 Wide</Button>
						<Button class="-item" onClick={this.onModifyGrid.bind(this, 4)}>4 Wide</Button>
						<Button class="-item if-sidebar-block" onClick={this.onModifyGrid.bind(this, 5)}>5 Wide</Button>
						<Button class="-item if-sidebar-block" onClick={this.onModifyGrid.bind(this, 6)}>6 Wide</Button>
					</Dropdown>
				</div>
				<div class="-footer">
				</div>
			</div>
		);
	}
}
