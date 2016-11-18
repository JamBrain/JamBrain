import { h, Component } from 'preact/preact';

export default class DialogLoginOrig extends Component {
	constructor() {
		this.state = {};
	}

	componentDidMount() {
	}
	
	render( props ) {
		return (
			<div id="dialog" class="dialog-base red_dialog" onclick={ e => event.stopPropagation() }>
				<div class="title big" id="dialog-title">Title</div>
				<div class="body">
					<div><img id="dialog-img" src="" width="64" height="64" /></div>
					<div id="dialog-text">Text</div>
				</div>
				<a href="#" id="dialog-focusfirst"></a>
				<div id="dialog-ok_only" class="buttons hidden">
					<button id="dialog-ok" class="normal focusable" onclick='dialog_Close();'>OK</button>
				</div>
				<a href="#" id="dialog-focuslast"></a>
			</div>
		);

//				<div class="buttons hidden" id="dialog-yes_no">
//					<button id="dialog-yes" class="normal focusable" onclick='dialog_DoAction();'>Yes</button>
//					<button id="dialog-no" class="normal focusable" onclick='dialog_Close();'>No</button>
//				</div>
	}
}
