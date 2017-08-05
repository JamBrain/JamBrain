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
			'items': null
		};
	}
	
	componentDidMount() {
		let props = this.props;
		let node = props.node;
		
		$Node.GetFeed(node.id, 'parent', ['group', 'event', 'page'])
			.then(r => {
				if ( r && r.feed ) {
					this.setState({'items': r.feed});
				}
			});
	}

	
	render( {node, user, extra, featured}, {items} ) {
		let ShowBody = null;
		
		if ( items && items.length ) {
			ShowBody = [];
			for (let idx = 0; idx < items.length; idx++) {
				ShowBody.push(<div>{idx}: {items[idx]}</div>);
			}
		}
		else if ( items ) {
			ShowBody = <div><SVGIcon gap>info</SVGIcon> No nodes found</div>;
		}
		else {
			ShowBody = <NavSpinner />;
		}

		return (
			<Common node={node} user={user} header={"/"+node.name}>
				<CommonBody>
					{ShowBody}
				</CommonBody>
			</Common>
		);
	}
}
