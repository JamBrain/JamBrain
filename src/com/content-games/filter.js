import {h, Component} from 'preact/preact';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';
import SVGIcon							from 'com/svg-icon/icon';
import InputText from 'com/input-text/text';
import FilterSpecial from 'com/content-games/filter-special';
import InputDropdown from 'com/input-dropdown/dropdown';
import NavLink from 'com/nav-link/link';

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

const VotingCategoryIds = {
    'overall': 1,
    'fun': 2,
    'innovation': 3,
    'theme': 4,
    'graphics': 5,
    'audio': 6,
    'humor': 7,
    'mood': 8,
};

const EventCategoryIds = {
    'all': 1,
    'jam': 2,
    'compo': 3,
    'unfinished': 4,
};

const SortCategoryIds = {
    'smart': 1,
    'classic': 2,
    'danger': 3,
    'zero': 4,
    'feedback': 5,
    'grade': 6,
};

export default class GamesFilter extends Component {
    constructor ( props ) {
        super(props);

        this.state = {
            'allowShowFilters': true,
            'simpleFilter': true,
            'reloads': {
                'sort': 0,
                'featured': 0,
                'voting': 0,
                'event': 0,
            },
        };

        this.onModifyTextFilter = this.onModifyTextFilter.bind(this);
        this.onTextFilerFocus = this.onTextFilerFocus.bind(this);
        this.onTextFilerBlur = this.onTextFilerBlur.bind(this);
        this.onFakeReload = this.onFakeReload.bind(this);
    }

    onFakeReload(category) {
        const reloads = this.state.reloads;
        reloads[category] += 1;
        this.setState({'reloads': reloads});
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

    render ( props, {allowShowFilters} ) {
        const {node} = props;
        const {Path, Filter, SubFilter, SubSubFilter} = props;
        const {showFeatured, showEvent, showVotingCategory, showRatingSort, showRatingSortDesc} = props;
        const WithSubFilter = SubFilter ? '/'+SubFilter : '';
        const WithSubSubFilter = SubSubFilter && SubSubFilter != 'featured' ? '/'+SubSubFilter : '';
        const ShowTextFilter = (
            <div class="feed-filter">
                <label>
                    <div class="-label">Filter:</div>
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
            const value = SubSubFilter == 'featured' ? 1 : 2;
            let Items = [
                [
                    1,
                    <div><SVGIcon>tag</SVGIcon><div>Featured Event</div></div>,
                    value == 1 ? undefined : <NavLink href={Path+Filter+WithSubFilter+''} class="-click-catcher" />,
                ],
                [
                    2,
                    <div><SVGIcon>tag</SVGIcon><div>All Events</div></div>,
                    value == 2 ? undefined : <NavLink href={Path+Filter+WithSubFilter+'/everything'} class="-click-catcher" />,
                ],
            ];
            ShowFeatured = (
                <InputDropdown
                    value={value}
                    items={Items}
                    class="-filter-featured"
                />
            );
        }

        let ShowEvent = null;
        if ( showEvent && allowShowFilters ) {
            let value = EventCategoryIds[SubFilter];
            let Items = [
                [
                    1,
                    <div><SVGIcon>gamepad</SVGIcon><div>All</div></div>,
                    value == 1 ? undefined : <NavLink href={Path+Filter+'/all'+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    2,
                    <div><SVGIcon>trophy</SVGIcon><div>Jam</div></div>,
                    value == 2 ? undefined : <NavLink href={Path+Filter+'/jam'+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    3,
                    <div><SVGIcon>trophy</SVGIcon><div>Compo</div></div>,
                    value == 3 ? undefined : <NavLink href={Path+Filter+'/compo'+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    4,
                    <div><SVGIcon>trash</SVGIcon><div>Unfinished</div></div>,
                    value == 4 ? undefined : <NavLink href={Path+Filter+'/unfinished'+WithSubSubFilter} class="-click-catcher" />,
                ],
            ];
            ShowEvent = (
                <InputDropdown
                    value={value}
                    items={Items}
                    class="-filter-event"
                />
            );
        }

        let ShowVotingCategory = null;
        if ( showVotingCategory && allowShowFilters ) {
            let value = VotingCategoryIds[Filter];
            let Items = [
                [
                    1,
                    <div>Overall</div>,
                    value == 1 ? undefined : <NavLink href={Path+'overall'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    2,
                    <div>Fun</div>,
                    value == 2 ? undefined : <NavLink href={Path+'fun'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    3,
                    <div>Innovation</div>,
                    value == 3 ? undefined : <NavLink href={Path+'innovation'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    4,
                    <div>Theme</div>,
                    value == 4 ? undefined : <NavLink href={Path+'theme'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    5,
                    <div>Graphics</div>,
                    value == 5 ? undefined : <NavLink href={Path+'graphics'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    6,
                    <div>Audio</div>,
                    value == 6 ? undefined : <NavLink href={Path+'audio'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    7,
                    <div>Humor</div>,
                    value == 7 ? undefined : <NavLink href={Path+'humor'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
                ],
                [
                    8,
                    <div>Mood</div>,
                    value == 8 ? undefined : <NavLink href={Path+'mood'+WithSubFilter+WithSubSubFilter} class="-click-catcher" />,
                ],
            ];

            ShowVotingCategory = (
                <InputDropdown
                    value={value}
                    items={Items}
                    class="-filter-category"
                />
            );
        }

        let ShowRatingSort = null;
        let ShowRatingSortDesc = null;
        if ( showRatingSort && allowShowFilters ) {
            let value = SortCategoryIds[Filter];
            let Items = [
               [
                   1,
                   <div><SVGIcon>ticket</SVGIcon><div>Smart</div></div>,
                   value == 1 ? undefined : <NavLink href={Path+'smart'+WithSubFilter} class="-click-catcher" />,
               ],
               [
                   2,
                   <div><SVGIcon>ticket</SVGIcon><div>Classic</div></div>,
                   value == 2 ? undefined : <NavLink href={Path+'classic'+WithSubFilter} class="-click-catcher" />,
               ],
               [
                   3,
                   <div><SVGIcon>help</SVGIcon><div>Danger</div></div>,
                   value == 3 ? undefined : <NavLink href={Path+'danger'+WithSubFilter} class="-click-catcher" />,
               ],
               [
                   4,
                   <div><SVGIcon>gift</SVGIcon><div>Zero</div></div>,
                   value == 4 ? undefined : <NavLink href={Path+'zero'+WithSubFilter} class="-click-catcher" />,
               ],
               [
                   5,
                   <div><SVGIcon>bubbles</SVGIcon><div>Feedback</div></div>,
                   value == 5 ? undefined : <NavLink href={Path+'feedback'+WithSubFilter} class="-click-catcher" />,
               ],
               [
                   6,
                   <div><SVGIcon>todo</SVGIcon><div>Grade</div></div>,
                   value == 6 ? undefined : <NavLink href={Path+'grade'+WithSubFilter} class="-click-catcher" />,
               ],
            ];
            if (showRatingSortDesc) {
                ShowRatingSortDesc = (
                    <CommonBody>{FilterDesc[Filter]}</CommonBody>
                );
            }

            ShowRatingSort = (
                <InputDropdown
                    value={value}
                    items={Items}
                    class="-filter-sort"
                />
            );
        }

        return (
            <Common node={node} class="filter-item filter-game">
                {ShowTextFilter}
                {ShowFeatured}
                {ShowEvent}
                {ShowVotingCategory}
                {ShowRatingSort}
                {ShowRatingSortDesc}
            </Common>
        );
    }
}
