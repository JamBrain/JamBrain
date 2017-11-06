import {h, Component} from 'preact/preact';

import LayoutSidebar from 'com/layouts/sidebar/sidebar';
import Router from 'com/router/router';
import Route from 'com/router/route';

export default class Page extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <LayoutSidebar {...props}>
                //content
            </LayoutSidebar>
        );
    }
}
