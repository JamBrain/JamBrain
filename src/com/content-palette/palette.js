import { h, Component } 				from 'preact/preact';

import SVGIcon 							from 'com/svg-icon/icon';

export default class ContentPalette extends Component {
	constructor( props ) {
		super(props);
	}

	render( props, state ) {
		var ColVariants = [
			<div class="-col-a">A</div>,
			<div class="-col-ab">AB</div>,
			<div class="-col-b">B</div>,
			<div class="-col-bc">BC</div>,
			<div class="-col-c">C</div>,
			<div class="-col-ca">CA</div>,

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
			<div class="-col-n">N</div>,
		];
		var BGVariants = [
			<div class="-bg-a">A</div>,
			<div class="-bg-ab">AB</div>,
			<div class="-bg-b">B</div>,
			<div class="-bg-bc">BC</div>,
			<div class="-bg-c">C</div>,
			<div class="-bg-ca">CA</div>,

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
			<div class="-bg-n">N</div>,
		];
		
		return (
			<div class="content-base content-palette">
				<div class="-bg-a">
					<div>COL_A</div>
					<div class="-bg-ag">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-ab">
					<div>COL_AB</div>
					<div class="-bg-abg">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-b">
					<div>COL_B</div>
					<div class="-bg-bg">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-bc">
					<div>COL_BC</div>
					<div class="-bg-bcg">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-c">
					<div>COL_C</div>
					<div class="-bg-cg">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-ca">
					<div>COL_CA</div>
					<div class="-bg-cag">xG</div>
					{ColVariants}
				</div>

				<div class="-col-a">
					<div>COL_A</div>
					<div class="-col-ag">xG</div>
					{BGVariants}
				</div>
				<div class="-col-ab">
					<div>COL_AB</div>
					<div class="-col-abg">xG</div>
					{BGVariants}
				</div>
				<div class="-col-b">
					<div>COL_B</div>
					<div class="-col-bg">xG</div>
					{BGVariants}
				</div>
				<div class="-col-bc">
					<div>COL_BC</div>
					<div class="-col-bcg">xG</div>
					{BGVariants}
				</div>
				<div class="-col-c">
					<div>COL_C</div>
					<div class="-col-cg">xG</div>
					{BGVariants}
				</div>
				<div class="-col-ca">
					<div>COL_CA</div>
					<div class="-col-cag">xG</div>
					{BGVariants}
				</div>


				<div class="-bg-am">
					<div>COL_AM</div>
					<div class="-bg-amg">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-abm">
					<div>COL_ABM</div>
					<div class="-bg-abmg">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-bm">
					<div>COL_BM</div>
					<div class="-bg-bmg">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-bcm">
					<div>COL_BCM</div>
					<div class="-bg-bcmg">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-cm">
					<div>COL_CM</div>
					<div class="-bg-cmg">xG</div>
					{ColVariants}
				</div>
				<div class="-bg-cam">
					<div>COL_CAM</div>
					<div class="-bg-camg">xG</div>
					{ColVariants}
				</div>

				<div class="-col-am">
					<div>COL_AM</div>
					<div class="-col-amg">xG</div>
					{BGVariants}
				</div>
				<div class="-col-abm">
					<div>COL_ABM</div>
					<div class="-col-abmg">xG</div>
					{BGVariants}
				</div>
				<div class="-col-bm">
					<div>COL_BM</div>
					<div class="-col-bmg">xG</div>
					{BGVariants}
				</div>
				<div class="-col-bcm">
					<div>COL_BCM</div>
					<div class="-col-bcmg">xG</div>
					{BGVariants}
				</div>
				<div class="-col-cm">
					<div>COL_CM</div>
					<div class="-col-cmg">xG</div>
					{BGVariants}
				</div>
				<div class="-col-cam">
					<div>COL_CAM</div>
					<div class="-col-camg">xG</div>
					{BGVariants}
				</div>
			</div>
		);
	}
}

