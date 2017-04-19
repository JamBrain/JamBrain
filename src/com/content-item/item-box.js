import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';

import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

import ContentCommon					from 'com/content-common/common';
import IMG2								from 'com/img2/img2';

export default class ContentItemBox extends Component {
	constructor( props ) {
		super(props);

    }


    render(props){
        props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
        props.class.push("content-item-box");

        return (
            <ContentCommon {...props}>
                <ContentCommonBodyTitle href={"/users/"} title={"My Awesome Game"} />
                <IMG2 src="" failsrc="///other/asset/TVFail.png" />
            </ContentCommon>
        );
    }

}
