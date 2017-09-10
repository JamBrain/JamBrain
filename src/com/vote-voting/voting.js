import { h, Component } 				from 'preact/preact';

import SVGIcon 							from 'com/svg-icon/icon';

import ContentCommonBody				from 'com/content-common/common-body';


export default class VoteVoting extends Component {

	
	constructor( props ) {
		super(props);
	}
	
	canReciveVotes() {
		const featuered = this.pops.featured;
		const node = this.props.node;
		
		return featured && featured.what_node && nodeKeys_HasPublishedParent(featured.what_node, node.parent);
	}
	
	render() {
	}
	
	
}