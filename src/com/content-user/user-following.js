import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentSimple					from 'com/content-simple/simple';
import ContentUserBar       			from 'com/content-user/user-bar';
import ContentCommon					from 'com/content-common/common';

import $Node							from '../../shrub/js/node/node';

export default class ContentUserFollowing extends Component {
	constructor( props ) {
		super(props);

        this.getFollowing = this.getFollowing.bind(this);
        this.hasPermission = this.hasPermission.bind(this);
        this.hasFollowing = this.hasFollowing.bind(this);

        this.state = {
            "followingNodes" : []
        };

    }

    componentDidMount() {
        // make sure we actually have a following to display
        if (this.hasFollowing() && this.hasPermission()){
            // if were looking at our own page then display following
            this.getFollowing(this.props.user.private.link.star);
        }

    }

    hasPermission(){
        return (this.props.node.id == this.props.user.id);
    }

    hasFollowing(){
        return (this.props.user['private'] && this.props.user.private['link']&& this.props.user.private.link['star']);
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

    render( props, state ) {
        props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
        props.class.push("content-user-following");

        // display a loading bar whilst we wait
        if (!this.hasPermission()){
            // if were not allowed to see the nodes following then display an error
            return <ContentError code="401">Permission Denied : Cannot see who other people are following </ContentError>;
        }
        else if (!this.hasFollowing())
        {
            return (
                <ContentCommon {...props}>
                    <h1> Your not currently following anyone </h1>
                </ContentCommon>
            );
        }
        else if (state.followingNodes  && state.followingNodes.length > 0){

            // turn our array of following nodes to ContentUserBar 's
            var following = state.followingNodes
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
                    <ContentUserBar node={following} user={props.user} featured={props.featured} />
                );
            });

            return (
                <ContentCommon {...props}>
                    {following}
                </ContentCommon>
            );
        }
        else{
            // Show a spinner whilst were loading
            return <ContentLoading />;
        }
    }
}
