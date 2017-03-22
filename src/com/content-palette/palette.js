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
			<div class="-col-l">L</div>,
			<div class="-col-w">W</div>,
			<div class="-col-g">G</div>,
			<div class="-col-k">K</div>,
			<div class="-col-d">D</div>,
		];
		var BGVariants = [
			<div class="-bg-a">A</div>,
			<div class="-bg-ab">AB</div>,
			<div class="-bg-b">B</div>,
			<div class="-bg-bc">BC</div>,
			<div class="-bg-c">C</div>,
			<div class="-bg-ca">CA</div>,
			<div class="-bg-l">L</div>,
			<div class="-bg-w">W</div>,
			<div class="-bg-g">G</div>,
			<div class="-bg-k">K</div>,
			<div class="-bg-d">D</div>,
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
			</div>
		);
	}
}

