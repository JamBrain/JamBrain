import {h, Component}					from 'preact/preact';
import ContentCommonBody				from 'com/content-common/common-body';

export default class ContentItemEmbed extends Component {
	constructor(props) {
		super(props);
	}

    render(props, state) {
        let {node} = props;

        let embed = null;
        if ( node_HasEmbed(node) ) {
            embed = '//files.jam.host/embed/$'+node.id+'/index.html';
        }

        // Deprecated
        if ( node.meta && node.meta.embed ) {
            embed = node.meta.embed;
        }

        if ( embed ) {
            let width = node.meta['embed-width'] ? node.meta['embed-width'] : 920;
            let height = node.meta['embed-height'] ? node.meta['embed-height'] : 480;

            // allow-same-origin -- allow cookie access (MK: Might not need this)
            // allow-scripts -- allow JavaScript
            // allow-pointer-lock -- allow mouse to capture pointer
            //
            // allow="fullscreen" -- modern way to allow it
            // allow="xr-spatial-tracking" -- AR/VR support
            // allow="cross-origin-isolated"
            return (
                <ContentCommonBody class="-embed -body">
                    <iframe sandbox="allow-scripts allow-pointer-lock" allowfullscreen src={embed} style={"margin: auto; display: block; width: "+width+"px; height: "+height+"px;"} />
                </ContentCommonBody>
            );
        }

        return <ContentCommonBody class="-embed -body" />;
    }
}
