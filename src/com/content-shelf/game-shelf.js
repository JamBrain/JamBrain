import {h, Component} from 'preact/preact';

import Shelf from 'com/content-shelf/shelf';
import ContentBox from 'com/content-box/box';

import $Node from '../../shrub/js/node/node';

export default class GameShelf extends Component {

    componentDidMount() {
        const props = this.props;
        const {id} = props.node;
		const methods = props.methods ? props.methods : ['parent', 'superparent'];
		const types = ['item'];
		const subtypes = ['game'];
		const subsubtypes = props.subsubtypes ? props.subsubtypes : null;
		const more = null;
		const limit = props.slots ? props.slots : 5;

		$Node.GetFeed( id, methods, types, subtypes, subsubtypes, more, limit )
		.then(r => {
			if ( r.feed && r.feed.length ) {
                this.setState({'games': r.feed});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
    }

    getGameBoxes(games) {
        if ( games ) {
            return games.map( ( node ) => <ContentBox node={node} /> );
        }
        else {
            return [];
        }
    }

    render ( props, {games} ) {
        let Games = this.getGameBoxes(games);
        let Props = Object.assing({}, props);
        delete Props.node;
        return <Shelf {...Props}>{Games}</Shelf>;
    }
}
