import { h, Component } 				from 'preact/preact';
import Sanitize							from '../internal/sanitize/sanitize';

import DialogBase						from 'com/dialog-base/base';
//import NavLink							from 'com/nav-link/link';

import $Node							from '../shrub/js/node/node';

export default class DialogCreate extends Component {
	constructor( props ) {
		super(props);
		
		this.doCreate = this.doCreate.bind(this);
	}
	
	doCreate( e ) {
		var event_id = this.props.extra.length ? Number.parseInt(this.props.extra[0]) : 0;
		var node_type = this.props.extra.length > 1 ? (this.props.extra[1]) : "";
		var node_subtype = this.props.extra.length > 2 ? (this.props.extra[2]) : "";
		
		console.log(event_id, node_type, node_subtype);
		
		if ( event_id ) {
			$Node.Add(event_id, node_type, node_subtype)
			.then(r => {
				//console.log('hurr',r);
				window.location.href = window.location.pathname;
			})
			.catch(err => {
				this.setState({ 'error': err });
			});
		}
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
						<div>Create a game for the active event?</div>
					</DialogBase>
				);
			}
		}
		return (
			<DialogBase title={"Create"} ok cancel oktext="Yes" canceltext="No" onclick={this.doCreate} {...ShowError}>
				<div>{"Would you like to create a game?"}</div>
			</DialogBase>
		);
	}
}
