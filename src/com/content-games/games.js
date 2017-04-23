import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';
import ContentItemBox					from 'com/content-item/item-box';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

//import ContentPost						from 'com/content-post/post';
//import ContentUser						from 'com/content-user/user';
import ContentMore						from 'com/content-more/more';

import $Node							from '../../shrub/js/node/node';

export default class ContentGames extends Component {

    constructor( props ) {
		super(props);

        this.state = {
			feed: [],
			hash: {},
			offset: 5, //10
			added: null
		};

		this.fetchMore = this.fetchMore.bind(this);

    }

    componentDidMount() {

        var props = this.props;

        this.getFeed(
            props.node.id,
            props.methods ? props.methods : ['parent', 'superparent'],
            props.types ? props.types : ['item'],
            props.subtypes ? props.subtypes : ['game'],
            props.subsubtypes ? props.subsubtypes : null,
            null,
            this.props.limit
        );
    }

    appendFeed( newfeed ) {
        var feed = this.state.feed;
        var hash = this.state.hash;

        for ( var idx = 0; idx < newfeed.length; idx++ ) {
            var info = newfeed[idx];
            if ( !hash[info['id']] ) {
                hash[info['id']] = feed.length;
                feed.push(info);
            }
        }
        this.setState({'feed': feed, 'hash': hash, 'added': newfeed.length});
    }

    getFeedIdsWithoutNodes() {
        var feed = this.state.feed;
        var hash = this.state.hash;

        var keys = [];
        for (var idx = 0; idx < feed.length; idx++ ) {
            if ( !feed[idx]['node'] )
                keys.push(feed[idx]['id']);
        }
        return keys;
    }

    getMissingNodes() {
        var keys = this.getFeedIdsWithoutNodes();

        if ( keys.length ) {
            console.log(keys);
            return $Node.GetKeyed( keys )
                .then(r => {
                    console.log(r);
                    var feed = this.state.feed;
                    var hash = this.state.hash;

                    for ( var node_id in r.node ) {
                        var id = r.node[node_id].id;

                        feed[hash[id]].node = r.node[node_id];
                    }

                    this.setState({'feed': feed, 'hash': hash});
                })
                .catch(err => {
                    this.setState({ 'error': err });
                });
        }

    }

    getFeed( id, methods, types, subtypes, subsubtypes, more, limit ) {
        $Node.GetFeed( id, methods, types, subtypes, subsubtypes, more, limit )
        .then(r => {
            console.log(r);
            if ( r.feed && r.feed.length ) {
                this.appendFeed(r.feed);
                return this.getMissingNodes();
            }
        })
        .catch(err => {
            this.setState({ 'error': err });
        });
    }

    fetchMore( offset ) {

        console.log("MORE");

        var props = this.props;
        var offset = this.state.offset;
//		var morenode = this.state.feed[this.state.feed.length-1];
//		var more = morenode.created ? morenode.created : morenode.modified;

        this.getFeed(
            props.node.id,
            props.methods ? props.methods : ['parent', 'superparent'],
            props.types ? props.types : ['item'],
            props.subtypes ? props.subtypes : ['games'],
            props.subsubtypes ? props.subsubtypes : null,
            offset,
            this.props.limit ? this.props.limit : 15
        );

        this.setState({'offset': offset + 10});
    }

    render( props, {feed, added, error}  ) {
        props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
        props.class.push("content-games");
        props.class.push("content-item-boxes");

        var LoadMore = null;

        if (error){
            return <ContentError code="400">"Bad Request : Couldn't load games"</ContentError>;
        }
        else if(feed && feed.length > 0)
        {
            var games = feed.map( g => {
                return <ContentItemBox node={g.node} path={props.path} user={props.user}/>;
            });

            if ( !props.nomore /*|| added >= 10*/ ){
				LoadMore = <ContentMore onclick={this.fetchMore} />;
            }

            return(
                <div class="-bodies content-games">
                    {props.children}
                    <div class={props.class}>
                        {games}
                    </div>
                    {LoadMore}
                </div>
            );
        }
        else if (!feed){
            return (
                <ContentCommon {...props}>
                    <ContentCommonBodyTitle href={""} title={"No Games!"} />
                    <p>Sorry there are no games yet.</p>
                </ContentCommon>
            );
        }
        else {
            // Show a spinner whilst were loading
            return <ContentLoading />;
        }
    }
}
