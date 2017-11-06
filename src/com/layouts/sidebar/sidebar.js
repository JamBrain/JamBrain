import {h, Component} from 'preact/preact';

import ViewBar 							from 'com/view-bar/bar';
import ViewHeader						from 'com/view-header/header';
import ViewSidebar						from 'com/view-sidebar/sidebar';
import ViewContent						from 'com/view-content/content';
import ViewFooter						from 'com/view-footer/footer';


export default class LayoutSidebar extends Component {
    render( props, state ) {
        let {user, featured} = props;

        return (
            <div id="layout">
                <ViewBar user={user} featured={featured}/>
                <div class="view">
                    <ViewHeader user={user} featured={featured}/>
                    <div id="content-sidebar">
                        {props.children}
                        <ViewSidebar user={user} featured={featured}/>
                    </div>
                    <ViewFooter/>
                </div>
            </div>
        );
    }
}
