import {h, Component}					from 'preact/preact';
import ContentPalette					from 'com/content-palette/palette';

export default class PageDevApiHealth extends Component {
    render( /*props, state*/ ) {
        return (
            <div id="content">
                <ContentPalette />
            </div>
        );
    }
}
