import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';
import ContentItemBox					from 'com/content-item/item-box';

//import ContentPost						from 'com/content-post/post';
//import ContentUser						from 'com/content-user/user';

import $Node							from '../../shrub/js/node/node';

export default class ContentGames extends Component {
    constructor( props ) {
		super(props);

        this.state = {
            "feed" : null
        };
    }

    componentDidMount() {
        this.getFeed(
            this.props.node.id,
            this.props.methods ? this.props.methods : ['parent', 'superparent'],
            this.props.types ? this.props.types : ['item'],
            this.props.subtypes ? this.props.subtypes : ['game'],
            this.props.subsubtypes ? this.props.subsubtypes : null
        );
    }

    getFeed( id, methods, types, subtypes, subsubtypes ) {
        $Node.GetFeed( id, methods, types, subtypes, subsubtypes )
        .then(r => {
            // If the feed is not empty
            if ( r.feed && r.feed.length ) {
                var keys = r.feed.map(v => v['id']);
                $Node.Get( keys )
                    .then(rr => {
                        // Make a id mapping object
                        let nodemap = {};
                        for ( let idx = 0; idx < rr.node.length; idx++ ) {
                            nodemap[rr.node[idx].id] = rr.node[idx];
                        }

                        // Using the original keys, return an ordered array of nodes
                        let new_state = {
                            'feed': keys.map(v => nodemap[v])
                        };

                        console.log(new_state.feed);
                        this.setState(new_state);
                    })
                    .catch(err => {
                        this.setState({ 'error': err });
                    });
            }
            else {
                this.setState({ 'feed': [] });
            }
        })
        .catch(err => {
            this.setState({ 'error': err });
        });
    }

    render( props, state ) {
        props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
        props.class.push("content-games");
        props.class.push("content-item-boxes");

        if (state['error']){
            return <ContentError code="400">"Bad Request : Couldn't load games"</ContentError>;
        }
        else if(state.feed)
        {
            var games = state.feed.map( g => {
                return <ContentItemBox node={g} path={props.path} user={props.user}/>;
            });

            return(
                <div class={props.class}>
                    {games}
                </div>
            );
        }
        else {
            // Show a spinner whilst were loading
            return <ContentLoading />;
        }
    }
}
