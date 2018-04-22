import {h, Component} from 'preact/preact';

import ContentStatsEvent				from 'com/content-stats/stats-event';

export default class EventStats extends Component {
    render( props, state ) {
        let {node} = props;

        return (
            <ContentStatsEvent node={node} />
        );
    }
}
