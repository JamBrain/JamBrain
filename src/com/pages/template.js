import {h, Component} from 'preact/preact';

export default class Page extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <div id="content">

            </div>
        );
    }
}
