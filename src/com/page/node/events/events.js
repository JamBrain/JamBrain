import {h, Component}					from 'preact/preact';
import PageNavRoot						from '../../nav/root';

//import ContentGroup						from 'com/content-group/group';
import ContentEvents from 'com/content-events/events';

export default class PageEvents extends Component {
    render( props ) {
        return (
			<div id="content">
				<PageNavRoot {...props} />
        <ContentEvents {...props} />
			</div>
        );
      //<ContentGroup {...props} />
    }
}
