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
        const {expandable} = props;

		$Node.GetFeed( id, methods, types, subtypes, subsubtypes, more, limit )
		.then(r => {
			if ( r.feed && r.feed.length ) {
                const nodes = [];
                r.feed.forEach( (node) => {
                    if (expandable || nodes.length < limit) {
                        nodes.push(node.id);
                    }
                });
                return $Node.Get(nodes)
                    .then( r => {
                        console.log(r);
                        this.setState({'games': r.node});
                    })
                    .catch(err => {
                        this.setState({'error': err});
                    });
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
    }

    getGameBoxes(games) {
        const {user, path, noevent} = this.props;
        if ( games ) {
            return games.map( ( node ) => <ContentBox node={node} user={user} path={path} noevent={noevent ? noevent : null} /> );
        }
        else {
            return [];
        }
    }

    render ( props, {games} ) {
        let Games = this.getGameBoxes(games);
        let Props = Object.assign({}, props);
        delete Props.node;
        return <Shelf {...Props}>{Games}</Shelf>;
    }
}
