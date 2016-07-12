import { h, Component } from 'preact/preact';

export default class NavBar extends Component {
	render(props,state) {
		return (
			<div class="nav-bar">
				<div class="box">Hullo</div>
				<div class="box">C</div>
				<div class="box">NOO</div>
				<div class="box -right">Well...</div>
				<div class="box -right">Sure</div>
			</div>
		);
	}
	
	componentWillMount() {
		console.log('mount');
	}
}
