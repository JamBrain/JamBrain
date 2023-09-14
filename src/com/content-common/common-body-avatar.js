import { Component } from 'preact';
import cN from 'classnames';
import './common-body-avatar.less';

import ButtonLink						from 'com/button-link/link';
import UIImage							from 'com/ui/image';
import UIIcon							from 'com/ui/icon';

import $Node							from 'shrub/js/node/node';
import $Asset							from 'shrub/js/asset/asset';

export default class ContentCommonBodyAvatar extends Component {
	constructor( props ) {
		super(props);

		this.onEdit = this.onEdit.bind(this);
	}

//	shouldComponentUpdate( nextProps ) {
//		return Shallow.Diff(this.props.children, nextProps.children);
//	}

	onEdit( e ) {
		let {node, user} = this.props;

		if ( !user || !user.id )
			return null;

		if ( e.target.files && e.target.files.length ) {
			var file = e.target.files[0];

			return $Asset.Upload(user.id, file)
				.then( r => {
					if ( r.path ) {
						var Avatar = '///content/'+r.path;

						if ( this.props.onchange ) {
							this.props.onchange(Avatar);
						}

						return $Node.AddMeta(node.id, {'avatar': Avatar});
					}
					else {
						alert(r.message);
					}
				})
				.catch(err => {
					this.setState({'error': err});
				});
		}
	}
	render( props ) {
		const isInProfile = props.node && (props.node.type === "user" && props.href === props.node.path);
		const isInteractive = (isInProfile && props.editing) || (!isInProfile && !props.editing);
		const Classes = `body -avatar ${props.class ?? ''} ${isInProfile && props.editing ? '-editing' : ''} ${isInteractive ? '-interactive' : ''}`;

		let AvatarFail = '///content/internal/user64.png';
		let Avatar = props.src ? props.src : AvatarFail;
		const name = props.node && props.node.name || "User";
		Avatar += ".64x64.fit.png";
		if (isInteractive) {
			return isInProfile && props.editing ?
				(<label>
					<input type="file" name="asset" style="display: none;" onChange={this.onEdit} />
					<div class={Classes}>
						<UIImage src={Avatar} failsrc={AvatarFail} />
						<UIIcon>edit</UIIcon>
					</div>
				</label>) :
				(<ButtonLink class={Classes} href={props.href}>
					<UIImage alt={name + "'s avatar image"} src={Avatar} failsrc={AvatarFail} />
				</ButtonLink>);
		}
		return (<span class={Classes}>
					<UIImage alt={name + "'s avatar image"} src={Avatar} failsrc={AvatarFail} />
				</span>);
	}
}
