import {h, Component} from 'preact';

import ContentHeadliner from './headliner';
import $Stats from 'shrub/js/stats/stats';
//import $Node from 'shrub/js/node/node';

export default class ContentHeadlinerEvent extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'stats': null,
		};
	}

	componentDidMount() {
		let props = this.props;

		if ( props.node ) {
			this.getStats(props.node.id);
		}
	}

	getStats( id ) {
		if ( id ) {
			$Stats.Get(id).then(r => {
				if ( r.stats ) {
					this.setState({'stats': r.stats});
				}
			})
            .catch(err => {
                this.setState({'error': err});
            });
		}
	}

	render( props, state ) {
		if ( state.stats ) {
            let footer = null;

			return <ContentHeadliner {...props} footer={footer} />;
		}

		return null;
	}
}
