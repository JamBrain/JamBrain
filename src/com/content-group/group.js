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

					return $Node.GetKeyed(r.feed);
				}
			})
			.then( r => {
				if ( r && r.node ) {
					this.setState({'nodes': r.node});
				}
			});
	}


	render( {node, user}, {items, nodes} ) {
		let ShowBody = [];
		if ( items && items.length && nodes ) {
			ShowBody.push(<div><NavLink href={node.path+'/..'}>/..</NavLink></div>);

			for (let idx = 0; idx < items.length; idx++) {
				let n = nodes[items[idx].id];
				ShowBody.push(<div><NavLink href={n.path}>{'/'+n.name}</NavLink> [{n.type}]</div>);
			}
		}
		else if ( items && items.length == 0 ) {
			ShowBody.push(<h3><SVGIcon gap>info</SVGIcon> No nodes found</h3>);
			ShowBody.push(<div><NavLink href={node.path+'/..'}>/..</NavLink></div>);
		}
		else {
			ShowBody.push(<NavSpinner />);
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
