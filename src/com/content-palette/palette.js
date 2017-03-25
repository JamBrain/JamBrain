import { h, Component } 				from 'preact/preact';

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
		
		this.ColorPerception = [
			<div class="-col-ag">A</div>,
			<div class="-col-abg">AB</div>,
			<div class="-col-bg">B</div>,
			<div class="-col-bcg">BC</div>,
			<div class="-col-cg">C</div>,
			<div class="-col-cag">CA</div>,

			<div class="-col-amg">AM</div>,
			<div class="-col-abmg">ABM</div>,
			<div class="-col-bmg">BM</div>,
			<div class="-col-bcmg">BCM</div>,
			<div class="-col-cmg">CM</div>,
			<div class="-col-camg">CAM</div>,

			<div class="-col-ndddddg">5</div>,
			<div class="-col-nddddg">4</div>,
			<div class="-col-ndddg">3</div>,
			<div class="-col-nddg">2</div>,
			<div class="-col-ndg">1</div>,
			<div class="-col-ng">0</div>,
			<div class="-col-nlg">1</div>,
			<div class="-col-nllg">2</div>,
			<div class="-col-nlllg">3</div>,
			<div class="-col-nllllg">4</div>,
			<div class="-col-nlllllg">5</div>,
		];

		this.BGPerception = [
			<div class="-bg-ag">A</div>,
			<div class="-bg-abg">AB</div>,
			<div class="-bg-bg">B</div>,
			<div class="-bg-bcg">BC</div>,
			<div class="-bg-cg">C</div>,
			<div class="-bg-cag">CA</div>,

			<div class="-bg-amg">AM</div>,
			<div class="-bg-abmg">ABM</div>,
			<div class="-bg-bmg">BM</div>,
			<div class="-bg-bcmg">BCM</div>,
			<div class="-bg-cmg">CM</div>,
			<div class="-bg-camg">CAM</div>,

			<div class="-bg-ndddddg">5</div>,
			<div class="-bg-nddddg">4</div>,
			<div class="-bg-ndddg">3</div>,
			<div class="-bg-nddg">2</div>,
			<div class="-bg-ndg">1</div>,
			<div class="-bg-ng">0</div>,
			<div class="-bg-nlg">1</div>,
			<div class="-bg-nllg">2</div>,
			<div class="-bg-nlllg">3</div>,
			<div class="-bg-nllllg">4</div>,
			<div class="-bg-nlllllg">5</div>,
		];	}
	
	genBGRow( symbol ) {
		return (
			<div class={'-bg-'+symbol}>
				<div>COL_{symbol.toUpperCase()}</div>
				<div class={'-bg-'+symbol+'g'}>PG</div>
				{this.ColorVariants}
			</div>
		);
	}
	genColorRow( symbol ) {
		return (
			<div class={'-col-'+symbol}>
				<div>COL_{symbol.toUpperCase()}</div>
				<div class={'-col-'+symbol+'g'}>PG</div>
				{this.BGVariants}
			</div>
		);
	}

	genBGPRow( symbol ) {
		return (
			<div class={'-bg-'+symbol}>
				<div>COL_{symbol.toUpperCase()}</div>
				{this.ColorPerception}
			</div>
		);
	}
	genColorPRow( symbol ) {
		return (
			<div class={'-col-'+symbol}>
				<div>COL_{symbol.toUpperCase()}</div>
				{this.BGPerception}
			</div>
		);
	}
	
	genBGPRowG( symbol ) {
		return (
			<div class={'-bg-'+symbol+'g'}>
				<div class={'-bg-'+symbol}>COL_{symbol.toUpperCase()}</div>
				{this.ColorPerception}
			</div>
		);
	}
	genColorPRowG( symbol ) {
		return (
			<div class={'-col-'+symbol+'g'}>
				<div class={'-col-'+symbol}>COL_{symbol.toUpperCase()}</div>
				{this.BGPerception}
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
				
				<h1>Color vs. Perception</h1>
				<div class="palette">
					{this.genBGPRow('a')}
					{this.genBGPRow('ab')}
					{this.genBGPRow('b')}
					{this.genBGPRow('bc')}
					{this.genBGPRow('c')}
					{this.genBGPRow('ca')}
	
					{this.genColorPRow('a')}
					{this.genColorPRow('ab')}
					{this.genColorPRow('b')}
					{this.genColorPRow('bc')}
					{this.genColorPRow('c')}
					{this.genColorPRow('ca')}

					{this.genBGPRow('am')}
					{this.genBGPRow('abm')}
					{this.genBGPRow('bm')}
					{this.genBGPRow('bcm')}
					{this.genBGPRow('cm')}
					{this.genBGPRow('cam')}
	
					{this.genColorPRow('am')}
					{this.genColorPRow('abm')}
					{this.genColorPRow('bm')}
					{this.genColorPRow('bcm')}
					{this.genColorPRow('cm')}
					{this.genColorPRow('cam')}

					{this.genBGPRow('nddddd')}
					{this.genBGPRow('ndddd')}
					{this.genBGPRow('nddd')}
					{this.genBGPRow('ndd')}
					{this.genBGPRow('nd')}
					{this.genBGPRow('n')}
					{this.genBGPRow('nl')}
					{this.genBGPRow('nll')}
					{this.genBGPRow('nlll')}
					{this.genBGPRow('nllll')}
					{this.genBGPRow('nlllll')}
	
					{this.genColorPRow('nddddd')}
					{this.genColorPRow('ndddd')}
					{this.genColorPRow('nddd')}
					{this.genColorPRow('ndd')}
					{this.genColorPRow('nd')}
					{this.genColorPRow('n')}
					{this.genColorPRow('nl')}
					{this.genColorPRow('nll')}
					{this.genColorPRow('nlll')}
					{this.genColorPRow('nllll')}
					{this.genColorPRow('nlllll')}
				</div>

				<h1>Perception vs. Perception</h1>
				<div class="palette">
					{this.genBGPRowG('a')}
					{this.genBGPRowG('ab')}
					{this.genBGPRowG('b')}
					{this.genBGPRowG('bc')}
					{this.genBGPRowG('c')}
					{this.genBGPRowG('ca')}
	
					{this.genColorPRowG('a')}
					{this.genColorPRowG('ab')}
					{this.genColorPRowG('b')}
					{this.genColorPRowG('bc')}
					{this.genColorPRowG('c')}
					{this.genColorPRowG('ca')}

					{this.genBGPRowG('am')}
					{this.genBGPRowG('abm')}
					{this.genBGPRowG('bm')}
					{this.genBGPRowG('bcm')}
					{this.genBGPRowG('cm')}
					{this.genBGPRowG('cam')}
	
					{this.genColorPRowG('am')}
					{this.genColorPRowG('abm')}
					{this.genColorPRowG('bm')}
					{this.genColorPRowG('bcm')}
					{this.genColorPRowG('cm')}
					{this.genColorPRowG('cam')}

					{this.genBGPRowG('nddddd')}
					{this.genBGPRowG('ndddd')}
					{this.genBGPRowG('nddd')}
					{this.genBGPRowG('ndd')}
					{this.genBGPRowG('nd')}
					{this.genBGPRowG('n')}
					{this.genBGPRowG('nl')}
					{this.genBGPRowG('nll')}
					{this.genBGPRowG('nlll')}
					{this.genBGPRowG('nllll')}
					{this.genBGPRowG('nlllll')}
	
					{this.genColorPRowG('nddddd')}
					{this.genColorPRowG('ndddd')}
					{this.genColorPRowG('nddd')}
					{this.genColorPRowG('ndd')}
					{this.genColorPRowG('nd')}
					{this.genColorPRowG('n')}
					{this.genColorPRowG('nl')}
					{this.genColorPRowG('nll')}
					{this.genColorPRowG('nlll')}
					{this.genColorPRowG('nllll')}
					{this.genColorPRowG('nlllll')}
				</div>
			</div>
		);
	}
}

