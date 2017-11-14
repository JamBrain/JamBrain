import {h, Component} from 'preact/preact';

//NOTE: JUST A TEMPLATE CLASS, NEVER ACTUALLY USED
export default class Page extends Component {
    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <div id="content">

            </div>
        );
    }
}
