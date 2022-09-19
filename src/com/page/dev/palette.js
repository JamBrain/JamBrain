import {h, Component}					from 'preact';
import ContentPalette					from 'com/content-palette/palette';

export default class PageDevPalette extends Component {
    render( /*props, state*/ ) {
        return (
            <div id="content">
                <ContentPalette />
            </div>
        );
    }
}
