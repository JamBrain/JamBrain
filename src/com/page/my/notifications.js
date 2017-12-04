import {h, Component}					from 'preact/preact';
import Notifications					from 'com/content-notifications/notifications';

export default class PageMyNotifications extends Component {
    render( props, state ) {
        return (
            <div id="content">
                <Notifications {...props} />
            </div>
        );
    }
}
