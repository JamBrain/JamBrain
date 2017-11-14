import {h, Component} from 'preact/preact';

import ContentGames						from 'com/content-games/games';
import GamesFilter from 'com/content-games/filter';

export default class HomeGames extends Component {
    render( props, state ) {
        let {node, user, path, extra} = props;

        const GamesFeedFilter = this.state.gamesFilter;

        let DefaultSubSubFilter = (featured && (featured.meta['theme-mode'] > 5)) ? 'featured' : 'all';
        let DefaultSubFilter = 'all';
        let DefaultFilter = 'danger';//'smart';

        function EvalFilter(str) {
            let MappingTable = {
                'all': 'compo+jam+craft+release',
                'classic': 'cool',
            };

            if ( MappingTable[str] )
                return MappingTable[str];
            return str;
        }

        let Methods = [];
        let Filter = DefaultFilter;
        let SubFilter = DefaultSubFilter;
        let SubSubFilter = DefaultSubSubFilter;

        if ( extra.length > 3 )
            SubSubFilter = extra[3];
        if ( extra.length > 2 )
            SubFilter = extra[2];
        if ( extra.length > 1 )
            Filter = extra[1];

        // Determine Filter
        if ( Filter.indexOf('-') == -1 ) {		// should be '+'
            switch ( Filter ) {
                case 'smart':
                case 'classic':
                case 'cool':
                case 'danger':
                case 'grade':
                case 'feedback':
                    Methods = [EvalFilter(Filter)];
                    break;

                case 'zero':
                    Methods = ['grade', 'reverse'];
                    break;

                case 'jam':
                case 'compo':
                case 'craft':
                case 'late':
                case 'release':
                case 'unfinished':
                    SubFilter = Filter;
                    Methods = [EvalFilter(DefaultFilter)];
                    break;

                default:
                    Methods = ['null'];
                    break;
            }
        }
        else {
            // If '+' was found, assume it's a multi-part subfilter and not a filter
            SubFilter = Filter.split('-');		// should be '+'
            Methods = [EvalFilter(DefaultFilter)];
        }

        let ShowFilters = null;
        if ( true ) {
            ShowFilters = <GamesFilter
                Filter={Filter}
                SubFilter={SubFilter}
                SubSubFilter={SubSubFilter}
                Path={this.props.path+'/games/'}
                node={node}
                onchangefilter={(filter)=>{this.setState({'gamesFilter': filter});}}
                showFeatured={true}
                showEvent={true}
                showRatingSort={true}
                showRatingSort={true}
            />;
        }

        let NodeArg = node;
        if ( SubSubFilter == 'featured' ) {
            Methods.push('parent');
            NodeArg = featured;
        }

        SubFilter = EvalFilter(SubFilter);

        return (
            <div id="content">
                {ShowFilters}
                <ContentGames node={NodeArg} user={user} path={path} extra={extra} methods={Methods} subsubtypes={SubFilter ? SubFilter : null} filter={GamesFeedFilter}/>
            </div>
        );
    }
}
