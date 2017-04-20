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
        var game = props.node;
        var title = game.name;
        var cover = game.meta.cover;
        var link = props.path + "/" + game.slug;

        props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
        props.class.push("content-item-box");

        return (
            <ContentCommon {...props}>
                <ContentCommonBodyTitle href={link} title={title} />
                <IMG2 src={cover} failsrc="///other/asset/TVFail.png" />
            </ContentCommon>
        );
    }

}
