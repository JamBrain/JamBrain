import {h, Component} 					from 'preact/preact';

import SVGIcon							from 'com/svg-icon/icon';
import ContentCommonNav					from 'com/content-common/common-nav';
import CommonButton						from 'com/content-common/common-nav-button';
import CommonButtonFollow				from 'com/content-common/common-nav-button-follow';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

import $Node							from '../../shrub/js/node/node';
//import $NodeLink						from '../../shrub/js/node/node_link';

export default class ContentUserBar extends Component {
	constructor( props ) {
		super(props);

		this.onAddTo = this.onAddTo.bind(this);
		this.onRemoveFrom = this.onRemoveFrom.bind(this);
	}

	onAddTo() {
		var node = this.props.node;
		var featured = this.props.featured;

		if ( featured && featured.focus && confirm("Add to Team?") ) {

			$Node.AddLink(featured.focus, node.id, {'author': null})
				.then( r => {
					console.log('did it', r);
				})
				.catch( err => {
					this.setState({'error': err});
				});
		}
	}

	onRemoveFrom() {
		var node = this.props.node;
		var featured = this.props.featured;

		if ( featured && featured.focus && confirm("Remove from Team?") ) {
			$Node.RemoveLink(featured.focus, node.id, {'author': null})
			.then( r => {
				console.log('did it', r);
			})
			.catch( err => {
				this.setState({'error': err});
			});
		}
	}

	render( props ) {
		var user = props.user;
		var node = props.node;
		var featured = props.featured;
//		var games =  node.games;
//		var articles = node.articles;
//		var posts = node.posts;

		var ShowFollow = null;
		var ShowAddToTeam = null;

		if ( user && user.id ) {
			ShowFollow = <CommonButtonFollow node={node} user={user} />;

			// Only team leaders can add team members
			if ( featured && featured.focus && featured.what_node && featured.what_node[featured.focus] && featured.what_node[featured.focus].author == user.id ) {
				// You can only add friends
				if ( nodeUser_IsFriend(user, node) ) {
					ShowAddToTeam = [
						<CommonButton class="" node={node} user={user} onclick={this.onAddTo}>
							<SVGIcon>pushpin</SVGIcon><div>Add To</div>
						</CommonButton>,
						<CommonButton class="" node={node} user={user} onclick={this.onRemoveFrom}>
							<SVGIcon>fire</SVGIcon><div>Remove From</div>
						</CommonButton>,
					];
				}
			}
		}

		return (
			<div class="content-user-bar">
				<ContentCommonBodyAvatar src={node.meta && node.meta.avatar ? node.meta.avatar : ''} />
				<ContentCommonBodyTitle href={"/users/"+node.slug} title={node.meta['real-name'] ? node.meta['real-name'] : node.name} subtitle={'@'+node.slug} />

				<ContentCommonNav>
					{ShowFollow}
					{ShowAddToTeam}
				</ContentCommonNav>
			</div>
		);
	}
}
