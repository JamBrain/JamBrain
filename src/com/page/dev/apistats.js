import {h, Component}					from 'preact/preact';
import $Stats							from 'shrub/js/stats/stats';
import HistogramChart					from 'com/visualization/histogramchart/histogramchart';
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

	apiChunk(name, api) {
		Hist = (<HistogramChart histogram={api.Histogram} />);

		let count = api.Count;
		let time = Math.round(api.AverageTime * 100 * 1000) / 100;
		let maxtime = Math.round(api.Percentiles["100"] * 100 * 1000) / 100;
		let rpm = Math.round(api.RPM * 10) / 10;

		return (
		<div>
			<h3>{name} (Count = {count}, AvgTime = {time}ms, MaxTime = {maxtime}ms, RPM={rpm})</h3>
			{Hist}
		</div>
		);
	}

    render( props, state ) {

		let ApiChunks = [];
		if ( state.allstats ) {
			ApiChunks.push(this.apiChunk("all", state.allstats));

			let chunks = Object.keys(state.rawstats);
			chunks.sort();

			chunks.forEach( (c) => {
				if ( c != "all" ) {
					ApiChunks.push(this.apiChunk(c, state.rawstats[c]));
				}
			});
		}
		let Pie = null;
		if ( state.allstats ) {
			let codes = state.allstats.StatusCodes;
			Pie = (<PieChart labels={Object.keys(codes)} values={Object.values(codes).map( (v) => parseInt(v, 10) )} />);
		}

        return (
            <div id="content">
				<h2>Detailed API stats (note: API time vs request Histograms, not time-based graphs)</h2>
				{ApiChunks}
				<h2>API status codes</h2>
				{Pie}
            </div>
        );
    }
}
