import {h, Component, Fragment} from 'preact';

import {ContentHeadliner} from "com/content/headliner";
import ContentStatsEvent from 'com/content-stats/stats-event';

export default class EventStats extends Component {
    render( props, state ) {
        let {node} = props;

        return (
            <Fragment>
                <ContentHeadliner title="Statistics" icon="stats" flagclass="-col-a" />
                <ContentStatsEvent node={node} />
            </Fragment>
        );
    }
}
