import {h, Component}					from 'preact/preact';
import PageNavRoot						from '../../nav/root';

import ContentGroup						from 'com/content-group/group';

export default class PageEvents extends Component {
    render( props ) {
        return (
			<div id="content">
				<PageNavRoot {...props} />
				<ContentGroup {...props} />
			</div>
        );
    }
}
