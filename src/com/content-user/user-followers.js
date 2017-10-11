import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentSimple					from 'com/content-simple/simple';
import ContentUserBar from 'com/content-user/user-bar';
import ContentCommon					from 'com/content-common/common';

import $Node							from '../../shrub/js/node/node';

export default class ContentUserFollowers extends Component {
	constructor( props ) {
		super(props);

        this.getFollowers = this.getFollowers.bind(this);
        this.hasPermission = this.hasPermission.bind(this);
        this.hasFollowers = this.hasFollowers.bind(this);

        this.state = {
            "followerNodes" : []
        };

    }

    componentDidMount() {
        // make sure we actually have followers to display
        if (this.hasFollowers() && this.hasPermission()){
            // if were looking at our own page then display followers
            this.getFollowers(this.props.user.private.refs.star);
        }
    }

    hasPermission(){
        return (this.props.node.id == this.props.user.id);
    }

    hasFollowers(){
        return (this.props.user['private'] && this.props.user.private['refs']&& this.props.user.private.refs['star']);
    }

    getFollowers(ids){
        $Node.Get(ids)
        .then(r => {
            this.setState({
                "followerNodes" : r.node,
                "loaded" : true
            });
        });
    }

    render( props, state ) {
        props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
        props.class.push("content-user-follower");

        if (!this.hasPermission()){
            // if were not allowed to see the nodes followers then display an error
            return <ContentError code="401">Permission Denied : Cannot see who other peoples followers are </ContentError>;
        }
        else if (!this.hasFollowers())
        {
            return (
                <ContentCommon {...props}>
                    <h1> No one is currently following you </h1>
                </ContentCommon>
            );
        }
        else if (state.followerNodes && state.followerNodes.length > 0){

            // turn our array of follower nodes to ContentUserBar 's
            var followers = state.followerNodes
            .sort( (a,b) => {

                var a_friend = props.user.private.link.star.indexOf(a.id) != -1;
                var b_friend = props.user.private.link.star.indexOf(b.id) != -1;

                if ( a_friend == b_friend){ // either their both freinds or both followers
                    return 0;
                }
                else if (a_friend){ // a is freind, b is follower
                    return -1;
                }
                else { // b is freind, a is follower
                    return 1;
                }
            })
            .map( follower => {
                return (
                    <ContentUserBar node={follower} user={props.user}/>
                );
            });

            return (
                <ContentCommon {...props}>
                    {followers}
                </ContentCommon>
            );
        }
        else{
            // Show a spinner whilst were loading
            return <ContentLoading />;
        }
    }
}
