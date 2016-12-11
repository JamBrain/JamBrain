import { h, Component } 				from 'preact/preact';
import Sanitize							from '../internal/sanitize/sanitize';

import DialogBase						from 'com/dialog-base/base';
//import NavLink							from 'com/nav-link/link';

import $User							from '../shrub/js/user/user';

export default class DialogCreate extends Component {
	constructor( props ) {
		super(props);
		
		this.doCreate = this.doCreate.bind(this);
	}
	
	doCreate( e ) {
		
	}

	render( {/*path,*/ extra}, {error} ) {
		var ShowError = error ? {'error': error} : {};
		
		var TargetNode = null;
		var What = "";
		
		if ( extra && extra.length ) {
			TargetNode = Number.parseInt(extra[0]);
			
			if ( extra.length > 1 ) {
				What = extra.slice(1).join('/');
			}
		}
		
		console.log("make: ", What);
		
		if ( TargetNode > 0 && What.length ) {
			if ( What == "item/game" ) {
				var ShowType = "Game";
				
				return (
					<DialogBase title={"Create "+ShowType} ok cancel oktext={"Create "+ShowType} onclick={this.doCreate} {...ShowError}>
						<div>Mahvel baby</div>
					</DialogBase>
				);
			}
		}
		return (
			<DialogBase title={"Create"} ok {...ShowError}>
				<div>{"I don't know how to make that"}</div>
			</DialogBase>
		);
	}
}
