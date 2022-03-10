import {h, Component, Fragment} from 'preact/preact';

import ContentGames						from 'com/content-games/games';
import GamesFilter from 'com/content-games/filter';

export default class EventGames extends Component {
    render( props, state ) {
        let {node, user, path, extra, featured} = props;

        let DefaultSubFilter = 'all';

        //TODO:: Make this automatically change between smart and danger
        let DefaultFilter = 'smart';

        // Results
        if ( node && node.meta && (node.meta['event-mode'] >= 8) ) {
            DefaultSubFilter = 'all';
            DefaultFilter = 'overall';
        }

        const GamesFeedFilter = this.state.gamesFilter;

        function EvalFilter2(str) {
            let MappingTable = {
                'all': 'compo+jam+extra',
                'classic': 'cool',

                'overall': 'grade-01-result',
                'fun': 'grade-02-result',
                'innovation': 'grade-03-result',
                'theme': 'grade-04-result',
                'graphics': 'grade-05-result',
                'audio': 'grade-06-result',
                'humor': 'grade-07-result',
                'mood': 'grade-08-result',
            };

            if ( MappingTable[str] )
                return MappingTable[str];
            return str;
        }

        let Methods = [];
        let Filter = DefaultFilter;
        let SubFilter = DefaultSubFilter;

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
                    Methods = [EvalFilter2(Filter)];
                    break;

                case 'overall':
                case 'fun':
                case 'innovation':
                case 'theme':
                case 'graphics':
                case 'audio':
                case 'humor':
                case 'mood':
                    Methods = [EvalFilter2(Filter), 'reverse'];
                    break;

                case 'zero':
                    Methods = ['grade', 'reverse'];
                    break;

                case 'jam':
                case 'compo':
                case 'craft':
                case 'extra':
                case 'late':
                case 'release':
                case 'unfinished':
                    SubFilter = Filter;
                    Methods = [EvalFilter2(DefaultFilter)];
                    break;

                default:
                    Methods = ['null'];
                    break;
            }
        }
        else {
            // If '+' was found, assume it's a multi-part subfilter and not a filter
            SubFilter = Filter.split('-');		// should be '+'
            Methods = [EvalFilter2(DefaultFilter)];
        }

        const urlParams = new URLSearchParams(window.location.search);
		const requestAdmin = parseInt(urlParams.get('admin'));
		const isAdmin = user && user.private && user.private.meta && user.private.meta.admin;

//		if (isAdmin) {
//			console.log("Requested Admin Display: " + requestAdmin);
//		}

        if ( node && node.meta && (node.meta['event-mode'] >= 8 || (isAdmin && requestAdmin)) ) {
             // Results
             ShowFilters = <GamesFilter
                    Filter={Filter}
                    SubFilter={SubFilter}
                    Path={this.props.path+'/'+extra[0]+'/'}
                    node={node}
                    onchangefilter={(filter)=>{this.setState({'gamesFilter': filter});}}
                    showEvent={true}
                    showVotingCategory={true}
                />;
        }
        else {
			// Voting
			ShowFilters = <GamesFilter
                    Filter={Filter}
                    SubFilter={SubFilter}
                    Path={this.props.path+'/'+extra[0]+'/'}
                    node={node}
                    onchangefilter={(filter)=>{this.setState({'gamesFilter': filter});}}
                    showEvent={true}
                    showRatingSort={true}
                    showRatingSortDesc={true}
                />;
        }

        SubFilter = EvalFilter2(SubFilter);

        // Require games to be part of the content node passed
        Methods.push('parent');
        //Methods.push('superparent');	// Why doesn't this work? It's unnecssary, but it should still work

        return (
            <>
                {ShowFilters}
                <ContentGames node={node} user={user} path={path} extra={extra} noevent methods={Methods} subsubtypes={SubFilter ? SubFilter : null} filter={GamesFeedFilter} />
            </>
        );
    }
}
