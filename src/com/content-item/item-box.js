import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';
import ContentLoading					from 'com/content-loading/loading';

import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

import ContentCommon					from 'com/content-common/common';
import IMG2								from 'com/img2/img2';

export default class ContentItemBox extends Component {
	constructor( props ) {
		super(props);

    }

    render( props ){
    	var node = props.node;
    	var user = props.user;

        if ( node ) {
            var title = node.name;
            var cover = (node['meta'] && node.meta['cover']) ? node.meta.cover : "";
            //var link = props.path + "/" + node.slug;

            props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
            props.class.push("content-item-box");

            return (
                <ContentCommon {...props}>
                    <ContentCommonBodyTitle href={node.path} title={title} />
                    <IMG2 src={cover} failsrc="///other/asset/TVFail.png" />
                </ContentCommon>
            );
        }
        else {
            return <ContentLoading />;
        }
    }
}
