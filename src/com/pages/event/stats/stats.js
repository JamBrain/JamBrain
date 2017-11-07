import {h, Component} from 'preact/preact';

export default class UserStats extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <ContentStatsEvent node={node} />
        );
    }
}
