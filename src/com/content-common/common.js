import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';

import FooterButtonMinMax				from 'com/content-common/common-footer-button-minmax';
import FooterButtonStar					from 'com/content-common/common-footer-button-star';
import FooterButtonLove					from 'com/content-common/common-footer-button-love';
import FooterButtonComments				from 'com/content-common/common-footer-button-comments';
import FooterButtonEdit					from 'com/content-common/common-footer-button-edit';

export default class ContentCommon extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'minimized': false
		};

		this.onMinMax = this.onMinMax.bind(this);
	}

	onMinMax( e ) {
		this.setState({
			'minimized': !this.state.minimized 
		});
	}

	render( props, {minimized, error} ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;

		// If a Minimized property was included, invert the internal state
		if ( props.minimized ) {
			minimized = !minimized;
		}
		
		if ( node && node.slug ) {
			let MainClass = [
				'content-base',
				'content-common'
			];
			
			if ( typeof props.class == 'string' ) {
				MainClass = MainClass.concat(props.class.split(' '));
			}
			
			if ( props.editing )
				MainClass.push('edit');
			if ( minimized )
				MainClass.push('minimized');

			let HasHeader = null;
			if ( props.header ) {
				HasHeader = <div class={[
					'content-common-header', 
					props.headerClass ? props.headerClass : ''
				]}>{props.header}</div>;
			}
			
//			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };
			
			
			let HasFooter = null;
			if ( true ) {
				let Left = [];
				if ( props['minmax'] ) {
					Left.push(<FooterButtonMinMax user={user} node={node} onclick={this.onMinMax} />);
				}
				
				let Right = [];
				if ( props['love'] )
					Right.push(<FooterButtonLove user={user} node={node} />);
				if ( props['comments'] )
					Right.push(<FooterButtonComments href={path} node={node} />);
				if ( props['star'] )
					Right.push(<FooterButtonStar user={user} node={node} />);
				if ( props['edit'] )
					Right.push(<FooterButtonEdit user={user} node={node} />);

				HasFooter = (
					<div class={[
						'content-common-footer', 
						(Left.length + Right.length) ? '-has-items' : ''
					]}>
						<div class="-left">
							{Left}
						</div>
						<div class="-right">
				  			{Right}
				  		</div>
					</div>
				);
			}

			return (
				<div class={MainClass}>
					{HasHeader}
					<div class="-bodies">{props.children}</div>
					{HasFooter}
				</div>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
