import { h, Component } from 'preact/preact';

export default class DarkOverlay extends Component {
	componentDidMount() {
		// Disables Mouse Wheel //
		document.body.addEventListener('mousewheel',function(event){
			event.preventDefault();
		    return false; 
		}, false);
	}
	
	render(props,state) {
		return (
			<div class="dark-overlay" id="dark-overlay"></div>
		);
	}
}
