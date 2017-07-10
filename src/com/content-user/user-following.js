import { h, Component } 				from 'preact/preact';

import SVGIcon							from 'com/svg-icon/icon';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentSimple					from 'com/content-simple/simple';
import ContentUserBar       			from 'com/content-user/user-bar';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBody				from 'com/content-common/common-body';

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
            return <ContentError code="403">Forbidden: You do not have permission to see who this user is following</ContentError>;
        }
        else if (!this.hasFollowing())
        {
            return (
                <ContentCommon {...props}>
                    <ContentCommonBody>You are not following anyone</ContentCommonBody>
                </ContentCommon>
            );
        }
        else if (state.followingNodes  && state.followingNodes.length > 0){

            // turn our array of following nodes to ContentUserBar 's
            var following = state.followingNodes
            .sort( (a,b) => {



                var a_friend = false;
                var b_friend = false;

                if ( props.user.private && props.user.private.refs && props.user.private.refs.star ){
                    props.user.private.refs.star.indexOf(a.id) != -1;
                    props.user.private.refs.star.indexOf(b.id) != -1;
                }

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
                	<ContentCommonBody>
                		<p>To add someone to your team, you need to both follow each other. Do so by visiting each others user pages, and clicking the <span><SVGIcon baseline small gap>user-plus</SVGIcon><strong>Follow</strong></span> button.</p>
	                	<p>Users that follow each other will be shown below as <span><SVGIcon baseline small gap>users</SVGIcon><strong>Friends</strong></span>.</p>
	                </ContentCommonBody>
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
