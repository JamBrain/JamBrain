import { h, Component } from 'preact/preact';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';
import CommonNav						from 'com/content-common/common-nav';
import CommonNavButton					from 'com/content-common/common-nav-button';
import SVGIcon							from 'com/svg-icon/icon';
import InputText from 'com/input-text/text';
import FilterSpecial from 'com/content-games/filter-special';

const FilterDesc = {
    'smart': <div><strong>Smart</strong>: This is the modern balancing filter. It balances the list using a combination of votes and the karma given to feedback. You start seeing diminishing returns after 50 ratings, but you can make up for it by leaving quality feedback.</div>,
    'unbound': <div><strong>Unbound</strong>: This is a variation of the Smart filter that is unbound. For curiousity.</div>,
    'classic': <div><strong>Classic</strong>: This is the classic balancing filter. It balances the list based on ratings alone. You start seeing diminishing returns after 100 ratings.</div>,
    'danger': <div><strong>Danger</strong>: This is the rescue filter. Everything with less than 20 ratings sorted top to bottom. Items on the first page are typically 1-2 rating away, so help them out!</div>, //'
    'zero': <div><strong>Zero</strong>: This filter shows the most neglected games. These are often new users that didn't understand you should rate games. Leaving them some feedback is greatly appreciated.</div>, //'
    'feedback': <div><strong>Feedback</strong>: This filter lets you find who is working the hardest, leaving quality feedback for others.</div>,
    'grade': <div><strong>Grade</strong>: This filter lets you find the games that have the most ratings.</div>,
};

export default class GamesFilter extends Component {
    constructor ( props ) {
        super(props);
        this.onModifyTextFilter = this.onModifyTextFilter.bind(this);
        this.onTextFilerFocus = this.onTextFilerFocus.bind(this);
        this.onTextFilerBlur = this.onTextFilerBlur.bind(this);

        this.state = {allowShowFilters: true};
    }

    onModifyTextFilter (e) {
        e.preventDefault();
        const {onchangefilter} = this.props;
        if (onchangefilter && e.target) {
            //console.log('New filter is', e.target.value);
            const { value } = e.target;
            onchangefilter({text: value, active: !!value});
        }
    }

    onTextFilerFocus (e) {
        this.setState({allowShowFilters: false});
    }

    onTextFilerBlur(e) {
        this.setState({allowShowFilters: true});
    }

    render ( props, {allowShowFilters}) {
        const {node} = props;
        const { Path, Filter, SubFilter, SubSubFilter} = props;
        const {showFeatured, showEvent, showVotingCategory, showRatingSort, showRatingSortDesc} = props;
        const WithSubFilter = SubFilter ? '/'+SubFilter : '';
        const WithSubSubFilter = SubSubFilter && SubSubFilter != 'featured' ? '/'+SubSubFilter : '';
        const tag = 'Linux';
        const ShowTextFilter = (
            <div class='feed-filter'>
                <span>Filter:</span>
                <FilterSpecial text={'Linux'} icon={'tag'} onclick={(value) => console.log(value)} />
                <InputText
                    onmodify={this.onModifyTextFilter}
                    onBlur={this.onTextFilerBlur}
                    onFocus={this.onTextFilerFocus}
                />
            </div>
        );

        let ShowFeatured = null;
        if (showFeatured && allowShowFilters) {
            ShowFeatured = (
                <CommonNav>
                    <CommonNavButton href={Path+Filter+WithSubFilter+''} class={SubSubFilter == 'featured' ? '-selected' : ''}><SVGIcon>tag</SVGIcon><div>Featured Event</div></CommonNavButton>
                    <CommonNavButton href={Path+Filter+WithSubFilter+'/everything'} class={SubSubFilter == 'everything' ? '-selected' : ''}><SVGIcon>tag</SVGIcon><div>All Events</div></CommonNavButton>
                </CommonNav>
            );
        }

        let ShowEvent = null;
        if (showEvent && allowShowFilters) {
            ShowEvent = (
                <CommonNav>
                    <CommonNavButton href={Path+Filter+'/all'+WithSubSubFilter} class={SubFilter == 'all' ? '-selected' : ''}><SVGIcon>gamepad</SVGIcon><div>All</div></CommonNavButton>
                    <CommonNavButton href={Path+Filter+'/jam'+WithSubSubFilter} class={SubFilter == 'jam' ? '-selected' : ''}><SVGIcon>trophy</SVGIcon><div>Jam</div></CommonNavButton>
                    <CommonNavButton href={Path+Filter+'/compo'+WithSubSubFilter} class={SubFilter == 'compo' ? '-selected' : ''}><SVGIcon>trophy</SVGIcon><div>Compo</div></CommonNavButton>
                    <CommonNavButton href={Path+Filter+'/unfinished'+WithSubSubFilter} class={SubFilter == 'unfinished' ? '-selected' : ''}><SVGIcon>trash</SVGIcon><div>Unfinished</div></CommonNavButton>
                </CommonNav>
            );
        }

        let ShowVotingCategory = null;
        if (showVotingCategory && allowShowFilters) {
            ShowVotingCategory = (
                <CommonNav>
                    <CommonNavButton href={Path+'overall/'+SubFilter} class={'-no-icon '+(Filter == 'overall' ? '-selected' : '')}><div>Overall</div></CommonNavButton>
                    <CommonNavButton href={Path+'fun/'+SubFilter} class={'-no-icon '+(Filter == 'fun' ? '-selected' : '')}><div>Fun</div></CommonNavButton>
                    <CommonNavButton href={Path+'innovation/'+SubFilter} class={'-no-icon '+(Filter == 'innovation' ? '-selected' : '')}><div>Innovation</div></CommonNavButton>
                    <CommonNavButton href={Path+'theme/'+SubFilter} class={'-no-icon '+(Filter == 'theme' ? '-selected' : '')}><div>Theme</div></CommonNavButton>
                    <CommonNavButton href={Path+'graphics/'+SubFilter} class={'-no-icon '+(Filter == 'graphics' ? '-selected' : '')}><div>Graphics</div></CommonNavButton>
                    <CommonNavButton href={Path+'audio/'+SubFilter} class={'-no-icon '+(Filter == 'audio' ? '-selected' : '')}><div>Audio</div></CommonNavButton>
                    <CommonNavButton href={Path+'humor/'+SubFilter} class={'-no-icon '+(Filter == 'humor' ? '-selected' : '')}><div>Humor</div></CommonNavButton>
                    <CommonNavButton href={Path+'mood/'+SubFilter} class={'-no-icon '+(Filter == 'mood' ? '-selected' : '')}><div>Mood</div></CommonNavButton>
                </CommonNav>
            );
        }

        let ShowRatingSort = null;
        let ShowRatingSortDesc = null;
        if (showRatingSort && allowShowFilters) {
            if (showRatingSortDesc) {
                ShowRatingSortDesc = (<CommonBody>{FilterDesc[Filter]}</CommonBody>);
            }
            ShowRatingSort = (
                <CommonNav>
                    <CommonNavButton href={Path+'smart'+WithSubFilter+WithSubSubFilter} class={Filter == 'smart' ? '-selected' : ''}><SVGIcon>ticket</SVGIcon><div>Smart</div></CommonNavButton>
                    <CommonNavButton href={Path+'classic'+WithSubFilter+WithSubSubFilter} class={Filter == 'classic' ? '-selected' : ''}><SVGIcon>ticket</SVGIcon><div>Classic</div></CommonNavButton>
                    <CommonNavButton href={Path+'danger'+WithSubFilter+WithSubSubFilter} class={Filter == 'danger' ? '-selected' : ''}><SVGIcon>help</SVGIcon><div>Danger</div></CommonNavButton>
                    <CommonNavButton href={Path+'zero'+WithSubFilter+WithSubSubFilter} class={Filter == 'zero' ? '-selected' : ''}><SVGIcon>gift</SVGIcon><div>Zero</div></CommonNavButton>
                    <CommonNavButton href={Path+'feedback'+WithSubFilter+WithSubSubFilter} class={Filter == 'feedback' ? '-selected' : ''}><SVGIcon>bubbles</SVGIcon><div>Feedback</div></CommonNavButton>
                    <CommonNavButton href={Path+'grade'+WithSubFilter+WithSubSubFilter} class={Filter == 'grade' ? '-selected' : ''}><SVGIcon>todo</SVGIcon><div>Grade</div></CommonNavButton>
                </CommonNav>
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
