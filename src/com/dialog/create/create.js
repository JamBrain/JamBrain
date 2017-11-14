import {h, Component} 					from 'preact/preact';
import Sanitize							from 'internal/sanitize/sanitize';

import DialogCommon						from 'com/dialog/common/common';

import $Node							from 'shrub/js/node/node';

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
				console.log('hurr', r);

				if ( r.path ) {
					if ( r.type == 'post' ) {
						window.location.href = r.path+'/edit';
					}
					else {
						window.location.href = r.path;
					}
				}
				else {
					this.setState({'error': r.message});
				}

				// This was the the old else
//				else
//					window.location.href = window.location.pathname;
			})
			.catch(err => {
				this.setState({'error': err});
			});
		}
	}

	render( props, {error} ) {
		var new_props = {
			'title': 'Create'
		};
		if ( error ) {
			new_props.error = error;
		}

		var TargetNode = null;
		var What = "";

		if ( props.extra && props.extra.length ) {
			TargetNode = Number.parseInt(props.extra[0]);

			if ( props.extra.length > 1 ) {
				What = props.extra.slice(1).join('/');
			}
		}

		// Ludum Dare Hack
		if ( TargetNode > 0 && What.length ) {
			if ( What == "item/game" ) {
				var ShowType = "Game";
				new_props.title += ' '+ShowType+" for Ludum Dare";
				new_props.oktext = "Create "+ShowType;

				return (
					<DialogCommon ok onok={this.doCreate} cancel explicit {...new_props}>
						<div><strong>Team Leaders</strong> and <strong>Solo</strong> participants, would you like to create a game?</div>
						<div>If you are a <strong>Team Member</strong>, add your <strong>Team Leader</strong> as friend, then ask them to add you.</div>
						<div>You need to <strong>make</strong> or <strong>join</strong> a game before you can create blog posts! When your team is done, you <strong>Publish</strong> your game (not before, thanks).</div>
					</DialogCommon>
				);
			}
			if ( What == "post" ) {
				var ShowType = "Blog Post";
				new_props.title += ' '+ShowType;
				new_props.oktext = "Create "+ShowType;

				return (
					<DialogCommon ok onok={this.doCreate} cancel explicit {...new_props}>
						<div>Create a new Blog Post?</div>
						<div>You can find your unpublished draft posts on your user page.</div>
					</DialogCommon>
				);
			}
		}

//		if ( TargetNode > 0 && What.length ) {
//			if ( What == "item/game" ) {
//				var ShowType = "Game";
//				new_props.title += ' '+ShowType;
//				new_props.oktext = "Create "+ShowType;
//
//				return (
//					<DialogCommon ok onok={this.doCreate} cancel explicit {...new_props}>
//						<div>Create a game for the active event?</div>
//					</DialogCommon>
//				);
//			}
//		}

		new_props.oktext = "Yes";
		new_props.canceltext = "No";

		return (
			<DialogCommon ok onok={this.doCreate} cancel explicit {...new_props}>
				<div>{"Would you like to create a game?"}</div>
			</DialogCommon>
		);
	}
}
