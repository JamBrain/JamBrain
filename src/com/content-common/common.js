import {h, Component}					from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';

import SVGIcon							from 'com/svg-icon/icon';

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

	render( props, state ) {
		let {node, user, path, extra} = props;
		let {minimized, error} = state;

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

			let HasOldHeader = null;
//			if ( props.oldheader ) {
//				let HeaderClass = cN('content-common-old-header', props.headerClass ? props.headerClass : '');
//
//				if ( props.headerIcon )
//					HasOldHeader = <div class={HeaderClass}><SVGIcon small>{props.headerIcon}</SVGIcon> {props.oldheader}</div>;
//				else
//					HasOldHeader = <div class={HeaderClass}>{props.oldheader}</div>;
//			}

			let HasHeader = null;
			if ( props.header ) {
				let HeaderClass = cN('content-common-header', props.headerClass ? props.headerClass : '');

				if ( props.headerIcon )
					HasHeader = <div class={HeaderClass}><SVGIcon>{props.headerIcon}</SVGIcon> <span>{props.header}</span></div>;
				else
					HasHeader = <div class={HeaderClass}><span>{props.header}</span></div>;
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
					Right.push(<FooterButtonLove node={node} user={user} path={path} />);
				if ( props['comments'] )
					Right.push(<FooterButtonComments node={node} user={user} path={path} />);
				if ( props['star'] )
					Right.push(<FooterButtonStar node={node} user={user} path={path} />);
				if ( props['edit'] )
					Right.push(<FooterButtonEdit node={node} user={user} path={path} />);

				HasFooter = (
					<div class={cN('content-common-footer', (Left.length + Right.length) ? '-has-items' : '')}>
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
					{HasOldHeader}
					<div class="-bodies">
						{HasHeader}
						{props.children}
					</div>
					{HasFooter}
				</div>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
