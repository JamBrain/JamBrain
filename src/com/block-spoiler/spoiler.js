import { h, Component } from 'preact/preact';

export default class SidebarUpcoming extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'visible': false
		};
		
		this.onClick = this.onClick.bind(this);
	}
	
	onClick( e ) {
		this.setState({'visible': true});
	}
	
	render( props, state ) {
		return (
			<blockquote class={cN('block-spoiler',state.visible ? '-visible' : '')} onclick={this.onClick}>
				{props.children}
			</blockquote>
		);
	}
}
