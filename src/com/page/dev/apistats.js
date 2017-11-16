import {h, Component}					from 'preact/preact';
import $Stats							from 'shrub/js/stats/stats';
import HistogramChart					from 'com/visualization/histogram/histogramchart';
import PieChart							from 'com/visualization/piechart/piechart';

export default class PageDevApiStats extends Component {

	constructor( props ) {
		super(props);

		this.state = {
			'error': null,

			'rawstats': null,
			'allstats': null,
		};
    }

	componentDidMount() {
		$Stats.GetApiStats()
		.then(r => {
			this.setState({'rawstats': r.stats});
			if ( r.stats ) {
				this.setState({'allstats': r.stats.all});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

    render( props, state ) {

		let Pie = null;
		if ( state.allstats ) {
			let codes = state.allstats.StatusCodes;
			Pie = (<PieChart labels={Object.keys(codes)} values={Object.values(codes)} />);
		}

        return (
            <div id="content">
				{Pie}
            </div>
        );
    }
}
