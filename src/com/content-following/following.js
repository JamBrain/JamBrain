import { h, Component } 				from 'preact/preact';
import ContentSimple					from 'com/content-simple/simple';
import ContentUserBar       			from 'com/content-userbar/userbar';
import ContentCommon					from 'com/content-common/common';

import $Node							from '../../shrub/js/node/node';

export default class ContentFollowing extends Component {
	constructor( props ) {
		super(props);

        console.log("props");
        console.log(props);

        this.getFollowing = this.getFollowing.bind(this);

        this.state = {
            "followingIDs" : props.user.private.link.star,
            "loaded": false,
            "followingNodes" : []
        };

        this.getFollowing();
    }

    getFollowing(){
        console.log("followingIDs");
        console.log(this.state.followingIDs);
        $Node.Get( this.state.followingIDs )
        .then(r => {
            console.log("followingNode");
            console.log(r.node);
            this.setState({
                "followingNodes" : r.node,
                "loaded" : true
            });
        });
    }

    render( props ) {
        props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
        props.class.push("content-userbar");

        if (!this.state.loaded){
            return (
                <div id="content">
                    <ContentCommon {...props}>
                        <ContentUserBar user={props.user}/>
                    </ContentCommon>

                    <h1> Following </h1>
                </div>
            );
        }

        var following = this.state.followingNodes.map( node => {
            return (
                <ContentCommon {...props}>
                    <ContentUserBar user={node}/>
                </ContentCommon>
            );
        });

        return (
            <div id="content">
                <ContentCommon {...props}>
                    <ContentUserBar user={props.user}/>
                </ContentCommon>

                <h1> Following </h1>
                <div class="following">
                    {following}
                </div>
            </div>
        );
    }
}
