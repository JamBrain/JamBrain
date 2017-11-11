import {h, Component} from 'preact/preact';

import LayoutSidebar from 'com/layouts/sidebar/sidebar';

export default class Page extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <LayoutSidebar {...props}>
                //content
            </LayoutSidebar>
        );
    }
}
