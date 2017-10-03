import { h } 				from 'preact/preact';

import ToolTip						from 'com/tooltip/tooltip';


export default class ToolTipText extends ToolTip {
	constructor( props ) {
		if (!props.lineHeight) {
			props.lineHeight = 18;
		}
		
		this.textSpan = null;
		props.PopUpContent = <div class='-tooltip-text' ref={(span) => this.textSpan = span}>{props.Text}</div>;
		super(props);
	}
	
	reshapeIfNeeded() {
		if (this.textSpan && this.state.showPopUp) {
			const docWidth = document.documentElement.clientWidth;
			const maxWidth = docWidth * this.props.maxWidth;
			const rect = this.textSpan.getBoundingClientRect();
			if (rect.height > this.props.lineHeight) {
				const bestWidth = Math.min(maxWidth, Math.floor(rect.height / this.props.lineHeight) * rect.width);
				this.textSpan.style.width = bestWidth + 'px';
			}
		
		} else {
			this.textSpan = null;
		}
	}
}