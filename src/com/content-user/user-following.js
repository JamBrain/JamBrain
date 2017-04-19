import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentSimple					from 'com/content-simple/simple';
import ContentUserBar       			from 'com/content-userbar/userbar';
import ContentCommon					from 'com/content-common/common';

import $Node							from '../../shrub/js/node/node';

export default class ContentUserFollowing extends Component {
	constructor( props ) {
		super(props);

        this.getFollowing = this.getFollowing.bind(this);

        this.state = {
            "allowed": true,
            "loaded": false,
            "followingNodes" : []
        };

        if (props.node.id == props.user.id){
            // if were looking at our own page then display following
            this.getFollowing(props.user.private.link.star);
        }
        else {
            // if it's not our page then we cannot see there following
            this.state.loaded = true;
            this.state.allowed = false;
        }
    }

    getFollowing(ids){
        $Node.Get(ids)
        .then(r => {
            this.setState({
                "followingNodes" : r.node,
                "loaded" : true
            });
        });
    }

    render( props ) {
        props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
        props.class.push("content-userbar");

        // display a loading bar whilst we wait
        if (!this.state.loaded){
            return (
                <ContentLoading />
            );
        }

        // if were not allowed to see the nodes following then display an error
        if (!this.state.allowed){
            return <ContentError code="401">Permission Denied : Cannot see who other people are following </ContentError>;

        }

        // turn our array of following nodes to ContentUserBar 's
        var following = this.state.followingNodes
        .sort( (a,b) => {

            var a_friend = props.user.private.refs.star.indexOf(a.id) != -1;
            var b_friend = props.user.private.refs.star.indexOf(b.id) != -1;

            if ( a_friend == b_friend){ // either their both freinds or both following
                return 0;
            }
            else if (a_friend){ // a is freind, b is followed
                return -1;
            }
            else { // b is freind, a is followed
                return 1;
            }
        })
        .map( following => {
            return (
                <ContentUserBar node={following} user={props.user}/>
            );
        });

        return (
            <ContentCommon {...props}>
                {following}
            </ContentCommon>
        );
    }
}
