import {Component} from 'preact';

import {Link, Icon, UISpinner} from 'com/ui';

import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';

import $Node							from 'backend/js/node/node';

const GROUP_ICONS = {
	'tag': 'tag',
	'tag/platform/source-code': 'embed',
	'tag/platform/microsoft-windows': 'windows',
	'tag/platform/linux': 'linux',
	'tag/platform/google-android': 'android',
	'tag/platform/apple': 'apple',
	'tag/platform/apple-macos': 'apple',
	'tag/platform/apple-ios': 'apple',
	'tag/platform/web-html5': 'html5',
	'tag/genre': 'lightbulb',
	'tag/input': 'gamepad',
	'group': 'folder-open',
	'group/tags': 'tags',
	'group/events': 'trophys',
	'event': 'trophy',
	'page': 'article',
};

const GROUP_SUFFIX = {
	'group': '/',
	'group/tags': '/',
	'group/events': '/',
};

export default class ContentGroup extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'items': null,
			'nodes': null
		};
	}

	getIconName(n) {
		let name = this.makePath(n);
		if ( GROUP_ICONS[name+'/'+n.slug] ) {
			return GROUP_ICONS[name+'/'+n.slug];
		}
		else if ( GROUP_ICONS[name] ) {
			return GROUP_ICONS[name];
		}
		else if ( GROUP_ICONS[n.type] ) {
			return GROUP_ICONS[n.type];
		}

		return "file-empty";
	}

	makePath(n) {
		let ret = "";

		if ( n.type ) {
			ret += n.type;
		}
		if ( n.subtype ) {
			ret += '/' + n.subtype;
		}
		if ( n.subsubtype ) {
			ret += '/' + n.subsubtype;
		}
		return ret;
	}

	componentDidMount() {
		let props = this.props;
		let node = props.node;

		$Node.GetFeed(node.id, 'parent', ['group', 'event', 'page', 'tag'], null, null, null, null, 200)
			.then(r => {
				if ( r && r.feed ) {
					this.setState({'items': r.feed});

					//return $Node.GetKeyed(r.feed);
					return $Node.Get(r.feed);
				}
			})
			.then( r => {
				if ( r && r.node ) {
					r.node.sort((a, b) => a.slug > b.slug ? 1 : a.slug < b.slug ? -1 : 0 );

					this.setState({'nodes': r.node});
				}
			});
	}


	render( {node, user}, {items, nodes} ) {
		let ShowBody = [];
		if ( items && items.length && nodes ) {
			ShowBody.push(<div><Link href={node.path+'/..'}><span><Icon src="previous" /> </span>../</Link></div>);

			//for (let idx = 0; idx < items.length; idx++) {
			for (let idx = 0; idx < nodes.length; idx++) {
				//let n = nodes[items[idx].id];
				let n = nodes[idx];

				let prefix = <span>[{this.makePath(n)}]</span>;
				if ( this.getIconName(n) ) {
					prefix = <span><Icon src={this.getIconName(n)} /> </span>;
				}

				let suffix = '';
				if ( GROUP_SUFFIX[this.makePath(n)] ) {
					suffix = GROUP_SUFFIX[this.makePath(n)];
				}

				ShowBody.push(<div><Link href={n.path}>{prefix}{n.name}{suffix}</Link></div>);
			}
		}
		else if ( items && items.length == 0 ) {
			ShowBody.push(<div><Link href={node.path+'/..'}><span><Icon src="previous" /> </span>../</Link></div>);
		}
		else {
			ShowBody.push(<UISpinner />);
		}

		{
			let suffix = '';
			if ( GROUP_SUFFIX[this.makePath(node)] ) {
				suffix = GROUP_SUFFIX[this.makePath(node)];
			}

			return (
				<Common node={node} user={user} header={node.name+suffix} headerIcon={this.getIconName(node)}>
					<CommonBody>
						<br /><br /><br />
						{ShowBody}
					</CommonBody>
				</Common>
			);
		}
	}
}
