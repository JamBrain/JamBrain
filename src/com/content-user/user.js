import {h, Component}	 				from 'preact/preact';

import ContentList						from 'com/content-list/list';
import ContentSimple					from 'com/content-simple/simple';
import ContentHeadliner					from 'com/content-headliner/headliner';

import ContentCommonNav					from 'com/content-common/common-nav';

import ButtonFollow						from 'com/content-common/common-nav-button-follow';

//import $Node							from 'shrub/js/node/node';


export default class ContentUser extends Component {
	constructor( props ) {
		super(props);
	}

	isEditMode() {
		let {extra} = this.props;
		return extra && extra.length && (extra[extra.length-1] == 'edit');
	}

	render( props ) {
		let {node, user, path, extra} = props;
		props = Object.assign({}, props);	// Shallow copy we can change props

		let IsHome = false;
		if ( extra && (extra.length == 0) ) {
			IsHome = true;
		}

		props.header = "USER";
		props.headerIcon = "user";
		props.headerClass = "-col-bc";

		props.subtitle = '@'+node.slug;
		props.notitleedit = true;

		props.authored = true;
		props.by = "Joined";
		props.noby = true;

		props.label = "Biography";

//		props.minmax = true;
//		if ( !IsHome ) {
//			props.minimized = true;
//		}

		let BodyNavBar = [];
		if ( !this.isEditMode() ) {
			if ( user && user.id && (node.id !== user.id) ) {
				BodyNavBar.push(<ButtonFollow node={node} user={user} />);
			}
		}

		let ShowContent = null;
		if ( IsHome ) {
			return (
				<ContentSimple {...props} class={cN("content-user", props.class)}>
					<ContentCommonNav>{BodyNavBar}</ContentCommonNav>
				</ContentSimple>
			);
		}
		return (
			<ContentHeadliner node={node} name="user" icon="user" class="-col-bc" published="Joined" at games articles trophies />
		);
	}
}
