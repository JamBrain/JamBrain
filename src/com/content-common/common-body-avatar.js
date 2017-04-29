import { h, Component } 				from 'preact/preact';
import Shallow			 				from 'shallow/shallow';

import NavLink							from 'com/nav-link/link';
import IMG2								from 'com/img2/img2';
import SVGIcon							from 'com/svg-icon/icon';

import $Node							from '../../shrub/js/node/node';
import $Asset							from '../../shrub/js/asset/asset';

export default class ContentCommonBodyAvatar extends Component {
	constructor( props ) {
		super(props);
		
		this.onEdit = this.onEdit.bind(this);
	}

	shouldComponentUpdate( nextProps ) {
		return Shallow.Diff(this.props.children, nextProps.children);
	}

	onEdit( e ) {
		var node = this.props.node;
		var user = this.props.user;
		
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
					this.setState({ 'error': err });
				});
		}
	}
	render( props ) {
		var Class = cN("content-common-body -avatar", props.class, props.editing ? '-editing' : '');
		
		var Avatar = props.src + ".64x64.fit.png";
		
		if ( props.editing ) {
			return (
				<label>
					<input type="file" name="asset" style="display: none;" onchange={this.onEdit} />
					<div class={Class}>
						<IMG2 src={Avatar} failsrc="///content/internal/user64.png" />
						<SVGIcon>edit</SVGIcon>
					</div>
				</label>
			);
		}		
		return (
			<div class={Class}>
				<IMG2 src={Avatar} failsrc="///content/internal/user64.png" />
			</div>
		);
	}
}
