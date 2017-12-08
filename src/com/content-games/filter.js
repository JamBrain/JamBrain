import {h, Component}					from 'preact/preact';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';
import SVGIcon							from 'com/svg-icon/icon';
import InputText						from 'com/input-text/text';
import FilterSpecial					from 'com/content-games/filter-special';
import InputDropdown					from 'com/input-dropdown/dropdown';
import NavLink							from 'com/nav-link/link';

const FilterDesc = {
	'smart': <div><strong>Smart</strong>: This is the modern balancing filter. It balances the list using a combination of votes and the karma given to feedback. You start seeing diminishing returns after 50 ratings, but you can make up for it by leaving quality feedback.</div>,
	'unbound': <div><strong>Unbound</strong>: This is a variation of the Smart filter that is unbound. For curiousity.</div>,
	'classic': <div><strong>Classic</strong>: This is the classic balancing filter. It balances the list based on ratings alone. You start seeing diminishing returns after 100 ratings.</div>,
	'danger': <div><strong>Danger</strong>: This is the rescue filter. Everything with less than 20 ratings sorted top to bottom. Items on the first page are typically 1-2 rating away, so help them out!</div>, //'
	'zero': <div><strong>Zero</strong>: This filter shows the most neglected games. These are often new users that didn't understand you should rate games. Leaving them some feedback is greatly appreciated.</div>, //'
	'feedback': <div><strong>Feedback</strong>: This filter lets you find who is working the hardest, leaving quality feedback for others.</div>,
	'grade': <div><strong>Grade</strong>: This filter lets you find the games that have the most ratings.</div>,
};

const PatternTag = /#[\w\d-]*/g;
const PatternAtName = /@[\w\d-]*/g;
const PatternWord = /[^ ]+/g;

export default class GamesFilter extends Component {
	constructor ( props ) {
		super(props);

		this.state = {"allowShowFilters": true, "simpleFilter": true};

		this.onModifyTextFilter = this.onModifyTextFilter.bind(this);
		this.onTextFilerFocus = this.onTextFilerFocus.bind(this);
		this.onTextFilerBlur = this.onTextFilerBlur.bind(this);
	}

	onModifyTextFilter ( e ) {
		e.preventDefault();
		const {onchangefilter} = this.props;
		const {simpleFilter} = this.state;
		if ( onchangefilter && e.target ) {
			const {value} = e.target;
			const freeWords = value.replace(PatternTag, '').replace(PatternAtName, '');
			const words = simpleFilter ? value.match(PatternWord) : freeWords.match(PatternWord);

			const filter = {
				'text': value,
				'active': !!value,
				'words': words,
				'wordsLowerCase': words ? words.map(w => w.toLowerCase()) : [],
				'atnames': value.match(PatternAtName),
				'tags': value.match(PatternTag),
			};
			onchangefilter(filter);
		}
	}

	onTextFilerFocus ( e ) {
		//this.setState({allowShowFilters: false});
	}

	onTextFilerBlur( e ) {
		//this.setState({allowShowFilters: true});
	}

	render( props, {allowShowFilters} ) {
		const {node} = props;
		const {Path, Filter, SubFilter, SubSubFilter} = props;
		const {showFeatured, showEvent, showVotingCategory, showRatingSort, showRatingSortDesc} = props;
		const WithSubFilter = SubFilter ? '/'+SubFilter : '';
		const WithSubSubFilter = SubSubFilter && SubSubFilter != 'featured' ? '/'+SubSubFilter : '';
		const ShowTextFilter = (
			<div class="feed-filter">
				<label><div class="-label">Filter:</div>
				<InputText
					onmodify={this.onModifyTextFilter}
					onBlur={this.onTextFilerBlur}
					onFocus={this.onTextFilerFocus}
				/>
				</label>
			</div>
		);

		let ShowFeatured = null;

		if ( showFeatured && allowShowFilters ) {
			let Items = [
				[
					1,
					<div><SVGIcon>tag</SVGIcon><div>Featured Event</div></div>,
					<NavLink href={Path+Filter+WithSubFilter+''} class="-click-catcher" />,
				],
				[
					2,
					<div><SVGIcon>tag</SVGIcon><div>All Events</div></div>,
					<NavLink href={Path+Filter+WithSubFilter+'/everything'} class="-click-catcher" />,
				],
			];
			const value = SubSubFilter == 'featured' ? 1 : 2;
			ShowFeatured = (
				<InputDropdown
					value={value}
					items={Items}
					useClickCatcher={true}
					class="-filter-featured"
					selfManaged={false}
				/>
			);
		}

		let ShowEvent = null;
		if ( showEvent && allowShowFilters ) {
			let Items = [
				[
					1,
					<div><SVGIcon>gamepad</SVGIcon><div>All</div></div>,
					<NavLink href={Path+Filter+'/all'+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					2,
					<div><SVGIcon>trophy</SVGIcon><div>Jam</div></div>,
					<NavLink href={Path+Filter+'/jam'+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					3,
					<div><SVGIcon>trophy</SVGIcon><div>Compo</div></div>,
					<NavLink href={Path+Filter+'/compo'+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					4,
					<div><SVGIcon>trash</SVGIcon><div>Unfinished</div></div>,
					<NavLink href={Path+Filter+'/unfinished'+WithSubSubFilter} class="-click-catcher" />,
				],
			];
			let value = 1;
			if (SubFilter == 'jam') {
				value = 2;
			}
			else if (SubFilter == 'compo') {
				value = 3;
			}
			else if (SubFilter == 'unfinished') {
				value = 4;
			}
			ShowEvent = (
				<InputDropdown
					value={value}
					items={Items}
					useClickCatcher={true}
					class="-filter-event"
					selfManaged={false}
				/>
			);
		}

		let ShowVotingCategory = null;
		if ( showVotingCategory && allowShowFilters ) {
			let Items = [
				[
					1,
					<div>Overall</div>,
					<NavLink href={Path+'overall'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					2,
					<div>Fun</div>,
					<NavLink href={Path+'fun'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					3,
					<div>Innovation</div>,
					<NavLink href={Path+'innovation'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					4,
					<div>Theme</div>,
					<NavLink href={Path+'theme'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					5,
					<div>Graphics</div>,
					<NavLink href={Path+'graphics'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					6,
					<div>Audio</div>,
					<NavLink href={Path+'audio'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					7,
					<div>Humor</div>,
					<NavLink href={Path+'humor'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
				],
				[
					8,
					<div>Mood</div>,
					<NavLink href={Path+'mood'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
				],
			];

			let value = 1;
			if (Filter == 'fun') {
				value = 2;
			}
			else if (Filter == 'innovation') {
				value = 3;
			}
			else if (Filter == 'theme') {
				value = 4;
			}
			else if (Filter == 'graphics') {
				value = 5;
			}
			else if (Filter == 'audio') {
				value = 6;
			}
			else if (Filter == 'humor') {
				value = 7;
			}
			else if (Filter == 'mood') {
				value = 8;
			}
			ShowVotingCategory = (
				<InputDropdown
					value={value}
					items={Items}
					useClickCatcher={true}
					class="-filter-category"
					selfManaged={false}
				/>
			);
		}

		let ShowRatingSort = null;
		let ShowRatingSortDesc = null;
		if ( showRatingSort && allowShowFilters ) {
			let Items = [
				[
					1,
					<div><SVGIcon>ticket</SVGIcon><div>Smart</div></div>,
					<NavLink href={Path+'smart'+WithSubFilter} class="-click-catcher" />,
				],
				[
					2,
					<div><SVGIcon>ticket</SVGIcon><div>Classic</div></div>,
					<NavLink href={Path+'classic'+WithSubFilter} class="-click-catcher" />,
				],
				[
					3,
					<div><SVGIcon>help</SVGIcon><div>Danger</div></div>,
					<NavLink href={Path+'danger'+WithSubFilter} class="-click-catcher" />,
				],
				[
					4,
					<div><SVGIcon>gift</SVGIcon><div>Zero</div></div>,
					<NavLink href={Path+'zero'+WithSubFilter} class="-click-catcher" />,
				],
				[
					5,
					<div><SVGIcon>bubbles</SVGIcon><div>Feedback</div></div>,
					<NavLink href={Path+'feedback'+WithSubFilter} class="-click-catcher" />,
				],
				[
					6,
					<div><SVGIcon>todo</SVGIcon><div>Grade</div></div>,
					<NavLink href={Path+'grade'+WithSubFilter} class="-click-catcher" />,
				],
			];
			let value = 1;
			if (Filter == 'classic') {
				value = 2;
			}
			else if (Filter == 'danger') {
				value = 3;
			}
			else if (Filter == 'zero') {
				value = 4;
			}
			else if (Filter == 'feedback') {
				value = 5;
			}
			else if (Filter == 'grade') {
				value = 6;
			}

			ShowRatingSortDesc = (
				<CommonBody>{FilterDesc[Filter]}</CommonBody>
			);

			ShowRatingSort = (
				<InputDropdown
					value={value}
					items={Items}
					useClickCatcher={true}
					class="-filter-event"
					selfManaged={false}
				/>
			);
		}

		//				{ShowTextFilter}
		return (
			<Common node={node} class="filter-item filter-game">
				{ShowFeatured}
				{ShowEvent}
				{ShowVotingCategory}
				{ShowRatingSort}
				{ShowRatingSortDesc}
			</Common>
		);
	}
}
