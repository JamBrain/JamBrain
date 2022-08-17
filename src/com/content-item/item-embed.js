import {h, Component}					from 'preact/preact';
import ContentCommonBody				from 'com/content-common/common-body';

export default class ContentItemEmbed extends Component {
	constructor(props) {
		super(props);
	}

    render(props, state) {
        let {node} = props;

        if ( node.meta && node.meta.embed ) {
            let width = node.meta['embed-width'] ? node.meta['embed-width'] : 920;
            let height = node.meta['embed-height'] ? node.meta['embed-height'] : 480;

            return (
                <ContentCommonBody class="-embed -body">
                    <iframe src={node.meta.embed} style={"margin: auto; display: block; width: "+width+"px; height: "+height+"px;"} />
                </ContentCommonBody>
            );
        }

        return <ContentCommonBody class="-embed -body" />;
    }
}
