import { h, Component } 				from 'preact/preact';

import SVGIcon 							from 'com/svg-icon/icon';

export default class ContentPalette extends Component {
	constructor( props ) {
		super(props);

		this.ColorVariants = [
			<div class="-col-a">A</div>,
			<div class="-col-ab">AB</div>,
			<div class="-col-b">B</div>,
			<div class="-col-bc">BC</div>,
			<div class="-col-c">C</div>,
			<div class="-col-ca">CA</div>,
			<div class="-col-n">N</div>,

			<div class="-col-am">AM</div>,
			<div class="-col-abm">ABM</div>,
			<div class="-col-bm">BM</div>,
			<div class="-col-bcm">BCM</div>,
			<div class="-col-cm">CM</div>,
			<div class="-col-cam">CAM</div>,

			<div class="-col-l">L</div>,
			<div class="-col-w">W</div>,
			<div class="-col-g">G</div>,
			<div class="-col-k">K</div>,
			<div class="-col-d">D</div>,
			<div class="-col-m">M</div>,
		];

		this.BGVariants = [
			<div class="-bg-a">A</div>,
			<div class="-bg-ab">AB</div>,
			<div class="-bg-b">B</div>,
			<div class="-bg-bc">BC</div>,
			<div class="-bg-c">C</div>,
			<div class="-bg-ca">CA</div>,
			<div class="-bg-n">N</div>,

			<div class="-bg-am">AM</div>,
			<div class="-bg-abm">ABM</div>,
			<div class="-bg-bm">BM</div>,
			<div class="-bg-bcm">BCM</div>,
			<div class="-bg-cm">CM</div>,
			<div class="-bg-cam">CAM</div>,

			<div class="-bg-l">L</div>,
			<div class="-bg-w">W</div>,
			<div class="-bg-g">G</div>,
			<div class="-bg-k">K</div>,
			<div class="-bg-d">D</div>,
			<div class="-bg-m">M</div>,
		];
	}
	
	genBGRow( symbol ) {
		return (
			<div class={'-bg-'+symbol}>
				<div>COL_{symbol.toUpperCase()}</div>
				<div class={'-bg-'+symbol+'g'}>xG</div>
				{this.ColorVariants}
			</div>
		);
	}
	genColorRow( symbol ) {
		return (
			<div class={'-col-'+symbol}>
				<div>COL_{symbol.toUpperCase()}</div>
				<div class={'-col-'+symbol+'g'}>xG</div>
				{this.BGVariants}
			</div>
		);
	}

	render( props, state ) {
		return (
			<div class="content-base content-palette">
				<h1>Standard Colors</h1>
				<div class="palette">
					{this.genBGRow('a')}
					{this.genBGRow('ab')}
					{this.genBGRow('b')}
					{this.genBGRow('bc')}
					{this.genBGRow('c')}
					{this.genBGRow('ca')}
					{this.genBGRow('n')}
	
					{this.genColorRow('a')}
					{this.genColorRow('ab')}
					{this.genColorRow('b')}
					{this.genColorRow('bc')}
					{this.genColorRow('c')}
					{this.genColorRow('ca')}
					{this.genColorRow('n')}
				</div>
	
				<h1>Mute Colors</h1>
				<div class="palette">
					{this.genBGRow('am')}
					{this.genBGRow('abm')}
					{this.genBGRow('bm')}
					{this.genBGRow('bcm')}
					{this.genBGRow('cm')}
					{this.genBGRow('cam')}
	
					{this.genColorRow('am')}
					{this.genColorRow('abm')}
					{this.genColorRow('bm')}
					{this.genColorRow('bcm')}
					{this.genColorRow('cm')}
					{this.genColorRow('cam')}
				</div>

				<h1>Relative Neutral Colors</h1>
				<div class="palette">
					{this.genBGRow('nddddd')}
					{this.genBGRow('ndddd')}
					{this.genBGRow('nddd')}
					{this.genBGRow('ndd')}
					{this.genBGRow('nd')}
					{this.genBGRow('n')}
					{this.genBGRow('nl')}
					{this.genBGRow('nll')}
					{this.genBGRow('nlll')}
					{this.genBGRow('nllll')}
					{this.genBGRow('nlllll')}
	
					{this.genColorRow('nddddd')}
					{this.genColorRow('ndddd')}
					{this.genColorRow('nddd')}
					{this.genColorRow('ndd')}
					{this.genColorRow('nd')}
					{this.genColorRow('n')}
					{this.genColorRow('nl')}
					{this.genColorRow('nll')}
					{this.genColorRow('nlll')}
					{this.genColorRow('nllll')}
					{this.genColorRow('nlllll')}
				</div>
			</div>
		);
	}
}

