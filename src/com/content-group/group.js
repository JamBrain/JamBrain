import { h, Component } 				from 'preact/preact';

import NavLink 							from 'com/nav-link/link';
import NavSpinner 						from 'com/nav-spinner/spinner';
import SVGIcon							from 'com/svg-icon/icon';

import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';

import $Node							from '../../shrub/js/node/node';

export default class ContentGroup extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'items': null,
			'nodes': null
		};
	}
	
	componentDidMount() {
		let props = this.props;
		let node = props.node;
		
		$Node.GetFeed(node.id, 'parent', ['group', 'event', 'page', 'tag'])
			.then(r => {
				if ( r && r.feed ) {
					this.setState({'items': r.feed});
					
					return $Node.Get(r.feed);
				}
			})
			.then( r => {
				if ( r && r.node ) {
					this.setState({'nodes': r.node});
				}
			});
	}

	
	render( {node, user, extra, featured}, {items, nodes} ) {
		let ShowBody = null;
		
		if ( items && items.length && nodes ) {
			ShowBody = [];
			for (let idx = 0; idx < items.length; idx++) {
				ShowBody.push(<div><NavLink href={nodes[idx].path}>{'/'+nodes[idx].name}</NavLink> [{nodes[idx].type}]</div>);
			}
		}
		else if ( items && items.length == 0 ) {
			ShowBody = <div><SVGIcon gap>info</SVGIcon> No nodes found</div>;
		}
		else {
			ShowBody = <NavSpinner />;
		}

		return (
			<Common node={node} user={user} header={"/"+node.name.toUpperCase()}>
				<CommonBody>
					{ShowBody}
				</CommonBody>
			</Common>
		);
	}
}
