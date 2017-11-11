import {h, Component} from 'preact/preact';

import ContentStatsEvent				from 'com/content-stats/stats-event';

export default class EventStats extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <ContentStatsEvent node={node} />
        );
    }
}
