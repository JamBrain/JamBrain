import { h, Component } from 'preact/preact';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';
import SVGIcon							from 'com/svg-icon/icon';
import InputText from 'com/input-text/text';
import FilterSpecial from 'com/content-games/filter-special';
import InputDropdown from 'com/input-dropdown/dropdown';

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

        this.state = {allowShowFilters: true, simpleFilter: true};

        this.onModifyTextFilter = this.onModifyTextFilter.bind(this);
        this.onTextFilerFocus = this.onTextFilerFocus.bind(this);
        this.onTextFilerBlur = this.onTextFilerBlur.bind(this);
        this.onModifyFeatured = this.onModifyFeatured.bind(this);
        this.onModifyCategory = this.onModifyCategory.bind(this);
        this.onModifyEvent = this.onModifyEvent.bind(this);
        this.onModifySort = this.onModifySort.bind(this);
    }

    componentDidMount() {
        this.prepForDropdowns(this.props);
    }

    componentWillReceiveProps (props, nextProps) {
        console.log('props', props, nextProps);
        this.prepForDropdowns(props);
    }

    prepForDropdowns(props) {
        const { Path, Filter, SubFilter, SubSubFilter} = props;
        const {showFeatured, showEvent, showVotingCategory, showRatingSort, showRatingSortDesc} = props;
        const WithSubFilter = SubFilter ? '/'+SubFilter : '';
        const WithSubSubFilter = SubSubFilter && SubSubFilter != 'featured' ? '/'+SubSubFilter : '';
        let dropDownItemLookup = {
            featured: {},
            eventType: {},
            category: {},
            sort: {},
        };
        if (showFeatured) {
            dropDownItemLookup.featured[1] = Path+Filter+WithSubFilter+'';
            dropDownItemLookup.featured[2] = Path+Filter+WithSubFilter+'everything';
            dropDownItemLookup.featured.selected = SubSubFilter == 'featured' ? 0 : 1;
        }
        if (showEvent) {
            dropDownItemLookup.eventType[1] = Path+Filter+'/all'+WithSubSubFilter;
            dropDownItemLookup.eventType[2] = Path+Filter+'/jam'+WithSubSubFilter;
            dropDownItemLookup.eventType[3] = Path+Filter+'/compo'+WithSubSubFilter;
            dropDownItemLookup.eventType[3] = Path+Filter+'/unfinished'+WithSubSubFilter;
            dropDownItemLookup.eventType.selected = 1;
            if (SubFilter == 'jam') {
                dropDownItemLookup.eventType.selected = 2;
            } else if (SubFilter == 'compo') {
                dropDownItemLookup.eventType.selected = 3;
            } else if (SubFilter == 'unfinished'){
                dropDownItemLookup.eventType.selected = 4;
            }
        }
        if (showVotingCategory) {
            dropDownItemLookup.category[1] = Path+'overall/'+SubFilter;
            dropDownItemLookup.category[2] = Path+'fun/'+SubFilter;
            dropDownItemLookup.category[3] = Path+'innovation/'+SubFilter;
            dropDownItemLookup.category[4] = Path+'theme/'+SubFilter;
            dropDownItemLookup.category[5] = Path+'graphics/'+SubFilter;
            dropDownItemLookup.category[6] = Path+'audio/'+SubFilter;
            dropDownItemLookup.category[7] = Path+'humor/'+SubFilter;
            dropDownItemLookup.category[8] = Path+'mood/'+SubFilter;
            dropDownItemLookup.category.selected = 1;
            if (Filter == 'fun') {
                dropDownItemLookup.category.selected = 2;
            } else if (Filter == 'innovation') {
                dropDownItemLookup.category.selected = 3;
            } else if (Filter == 'theme') {
                dropDownItemLookup.category.selected = 4;
            } else if (Filter == 'graphics') {
                dropDownItemLookup.category.selected = 5;
            } else if (Filter == 'audio') {
                dropDownItemLookup.category.selected = 6;
            } else if (Filter == 'humor') {
                dropDownItemLookup.category.selected = 7;
            } else if (Filter == 'mood') {
                dropDownItemLookup.category.selected = 8;
            }
        }

        if (showRatingSort) {
            dropDownItemLookup.sort[1] = Path+'smart'+WithSubFilter+WithSubSubFilter;
            dropDownItemLookup.sort[2] = Path+'classic'+WithSubFilter+WithSubSubFilter;
            dropDownItemLookup.sort[3] = Path+'danger'+WithSubFilter+WithSubSubFilter;
            dropDownItemLookup.sort[4] = Path+'zero'+WithSubFilter+WithSubSubFilter;
            dropDownItemLookup.sort[5] = Path+'feedback'+WithSubFilter+WithSubSubFilter;
            dropDownItemLookup.sort[6] = Path+'grade'+WithSubFilter+WithSubSubFilter;
            dropDownItemLookup.sort.selected = 1;
            if (Filter == 'classic') {
                dropDownItemLookup.sort.selected = 2;
            } else if (Filter == 'danger') {
                dropDownItemLookup.sort.selected = 3;
            } else if (Filter == 'zero') {
                dropDownItemLookup.sort.selected = 4;
            } else if (Filter == 'feedback') {
                dropDownItemLookup.sort.selected = 5;
            } else if (Filter == 'grade') {
                dropDownItemLookup.sort.selected = 6;
            }
            if (showRatingSortDesc) {
                dropDownItemLookup.sort.desc = (
                    <CommonBody>{FilterDesc[Filter]}</CommonBody>
                );
            } else {
                dropDownItemLookup.sort.desc = null;
            }
        }
        this.setState({dropDownItemLookup});
    }

    onModifyTextFilter (e) {
        e.preventDefault();
        const {onchangefilter} = this.props;
        const {simpleFilter} = this.state;
        if (onchangefilter && e.target) {
            //console.log('New filter is', e.target.value);
            const { value } = e.target;
            const freeWords = value.replace(PatternTag, '').replace(PatternAtName, '');
            onchangefilter({
                text: value,
                active: !!value,
                words: simpleFilter ? value.match(PatternWord) : freeWords.match(PatternWord),
                atnames: value.match(PatternAtName),
                tags: value.match(PatternTag),
            });
        }
    }

    onModifyDropdowns (lookup, index) {
        const href = lookup[index];
        console.log(index, href);

        //dispatchNavChangeEvent(href);
    }

    onModifyFeatured (index) {
        this.onModifyDropdowns(this.state.dropDownItemLookup.featured, index);
    }

    onModifyEvent (index) {
        this.onModifyDropdowns(this.state.dropDownItemLookup.eventType, index);
    }

    onModifyCategory (index) {
        this.onModifyDropdowns(this.state.dropDownItemLookup.category, index);
    }

    onModifySort (index) {
        this.onModifyDropdowns(this.state.dropDownItemLookup.sort, index);
    }

    onTextFilerFocus (e) {
        this.setState({allowShowFilters: false});
    }

    onTextFilerBlur(e) {
        this.setState({allowShowFilters: true});
    }

    render ( props, {allowShowFilters, dropDownItemLookup}) {
        const {node} = props;
        const { Path, Filter, SubFilter, SubSubFilter} = props;
        const {showFeatured, showEvent, showVotingCategory, showRatingSort, showRatingSortDesc} = props;
        const WithSubFilter = SubFilter ? '/'+SubFilter : '';
        const WithSubSubFilter = SubSubFilter && SubSubFilter != 'featured' ? '/'+SubSubFilter : '';
        allowShowFilters = allowShowFilters && dropDownItemLookup;
        const ShowTextFilter = (
            <div class='feed-filter'>
                <label><div class='-label'>Filter:</div>
                <InputText
                    onmodify={this.onModifyTextFilter}
                    onBlur={this.onTextFilerBlur}
                    onFocus={this.onTextFilerFocus}
                />
                </label>
            </div>
        );

        let ShowFeatured = null;

        if (showFeatured && allowShowFilters) {
            let Items = [
                [1, <div><SVGIcon>tag</SVGIcon><div>Featured Event</div></div>],
                [2, <div><SVGIcon>tag</SVGIcon><div>All Events</div></div>],
            ];
            ShowFeatured = (
                <InputDropdown
                    value={dropDownItemLookup.featured.selected}
                    items={Items} onmodify={this.onModifyFeatured}
                    useClickCatcher={true}
                    class='-filter-featured'
                />
            );
        }

        let ShowEvent = null;
        if (showEvent && allowShowFilters) {
            let Items = [
                [1, <div><SVGIcon>gamepad</SVGIcon><div>All</div></div>],
                [2, <div><SVGIcon>trophy</SVGIcon><div>Jam</div></div>],
                [3, <div><SVGIcon>trophy</SVGIcon><div>Compo</div></div>],
                [4, <div><SVGIcon>trash</SVGIcon><div>Unfinished</div></div>],
            ];
            ShowEvent = (
                <InputDropdown
                    value={dropDownItemLookup.eventType.selected}
                    items={Items} onmodify={this.onModifyEvent}
                    useClickCatcher={true}
                    class='-filter-event'
                />
            );
        }

        let ShowVotingCategory = null;
        if (showVotingCategory && allowShowFilters) {
            let Items = [
                [1, <div>Overall</div>],
                [2, <div>Fun</div>],
                [3, <div>Innovation</div>],
                [4, <div>Theme</div>],
                [5, <div>Graphics</div>],
                [6, <div>Audio</div>],
                [7, <div>Humor</div>],
                [8, <div>Mood</div>],
            ];

            ShowVotingCategory = (
                <InputDropdown
                    value={dropDownItemLookup.category.selected}
                    items={Items} onmodify={this.onModifyCategory}
                    useClickCatcher={true}
                    class='-filter-category'
                />
            );
        }

        let ShowRatingSort = null;
        let ShowRatingSortDesc = null;
        if (showRatingSort && allowShowFilters) {
            if (showRatingSortDesc) {
                ShowRatingSortDesc = dropDownItemLookup.sort.desc;
            }
            let Items = [
               [1, <div><SVGIcon>ticket</SVGIcon><div>Smart</div></div>],
               [2, <div><SVGIcon>ticket</SVGIcon><div>Classic</div></div>],
               [3, <div><SVGIcon>help</SVGIcon><div>Danger</div></div>],
               [4, <div><SVGIcon>gift</SVGIcon><div>Zero</div></div>],
               [5, <div><SVGIcon>bubbles</SVGIcon><div>Feedback</div></div>],
               [6, <div><SVGIcon>todo</SVGIcon><div>Grade</div></div>],
            ];
            ShowRatingSort = (
                <InputDropdown
                    value={dropDownItemLookup.sort.selected}
                    items={Items} onmodify={this.onModifySort}
                    useClickCatcher={true}
                    class='-filter-sort'
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
