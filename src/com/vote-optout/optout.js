import { h, Component } 				from 'preact/preact';

import SVGIcon 							from 'com/svg-icon/icon';
import ButtonBase						from 'com/button-base/base';

import ContentCommonBody				from 'com/content-common/common-body';
import $NodeMeta						from '../../shrub/js/node/node_meta';


export default class VoteOptOut extends Component {

	
	constructor( props ) {
		super(props);
	}

	static canOptOut(nodeComponent) {
		return nodeComponent && node_CanPublish(nodeComponent);
	}
	
	onOptOut( name, value ) {
		let Node = this.props.node;
		
		let Name = name+'-out';
		let Data = {};
		
		if ( value ) {
			Data[Name] = 1;
			
			return $NodeMeta.Add(Node.id, Data)
				.then(r => {
					if ( r && r.changed ) {
						Node.meta[Name] = Data[Name];
						this.props.optOutCallback();
					}
					return r;
				});
		}
		else {
			Data[Name] = 0;

			return $NodeMeta.Remove(Node.id, Data)
				.then(r => {
					if ( r && r.changed ) {
						Node.meta[Name] = Data[Name];
						this.props.optOutCallback();
					}
					return r;
				});			
		}
	}
	
	render(props, state) {

		const nodeComponent = props.nodeComponent;
		const node = props.node;
		
		let Lines = [];
		
		for ( let key in nodeComponent.meta ) {
			// Is it a valid grade ?
			let parts = key.split('-');
			if ( parts.length == 3 && parts[0] == 'grade' && parts[2] == 'optional' ) {
				// Assuming the category isn't optional
				if ( nodeComponent.meta[key]|0 ) {
					let BaseKey = parts[0]+'-'+parts[1];
					
					Lines.push({
						'key': BaseKey, 
						'name': nodeComponent.meta[BaseKey],
						'value': (node.meta ? !(node.meta[BaseKey+'-out']|0) : false)
					});
				}
			}
		}

		let OptLines = [];

		for ( let idx = 0; idx < Lines.length; idx++ ) {
			let Line = Lines[idx];
			
			let Icon = null;
			if ( Line.value )
				Icon = <SVGIcon small baseline>checkbox-unchecked</SVGIcon>;
			else
				Icon = <SVGIcon small baseline>checkbox-checked</SVGIcon>;
			
			OptLines.push(<ButtonBase onclick={this.onOptOut.bind(this, Line.key, Line.value)}>{Icon} Do not rate me in <strong>{Line.name}</strong></ButtonBase>);
		}
		
		return (
			<ContentCommonBody class="-opt-out">
				<div class="-label">Voting Category Opt-outs</div>
				{OptLines}
				<div class="-footer">
					Opt-out of categories here if your team didn't make all your graphics, audio, or music during the event.
					Many participants are making original graphics, audio and music from scratch during the event. As a courtesy, we ask you to opt-out if you didn't do the same.
					Also, some games are not meant to be Humourous or Moody, so you can choose to opt-out of these too.
				</div>
			</ContentCommonBody>
		);
	
	}
	
}