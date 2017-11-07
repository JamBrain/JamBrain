import {h, Component} from 'preact/preact';

export default class UserStats extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        let NewPath = path+'/'+extra[0];
        let NewExtra = extra.slice(1);

        return (
            <ContentEventTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />
        );
    }
}
