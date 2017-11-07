import {h, Component} from 'preact/preact';

import LayoutSidebar from 'com/layouts/sidebar/sidebar';
import ContentError						from 'com/content-error/error';

export default class PageError extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <ContentError />
        );
    }
}
