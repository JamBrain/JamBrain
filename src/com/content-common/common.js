import {h, Component}					from 'preact';

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

	render( props, state ) {
		let {node, user, path, extra, editing} = props;
		let {minimized, error} = state;

		// If a Minimized property was included, invert the internal state
		if ( props.minimized ) {
			minimized = !minimized;
		}

		if ( node && node.slug ) {
			/*
			let MainClass = [
				'content',
				'-base',
				'content-common'
			];

			if ( typeof props.class == 'string' ) {
				MainClass = MainClass.concat(props.class.split(' '));
			}

			if ( props.editing )
				MainClass.push('edit');
			if ( minimized )
				MainClass.push('minimized');
			*/


//			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };


			let Footer = null;
			if ( !props.nofooter ) {
				let Left = [];
				if ( props['minmax'] ) {
					Left.push(<FooterButtonMinMax {...props} onclick={this.onMinMax} />);
				}

				let Right = [];
				if ( props['star'] )
					Right.push(<FooterButtonStar {...props} />);
				if ( props['love'] )
					Right.push(<FooterButtonLove {...props} />);
				if ( props['comments'] )
					Right.push(<FooterButtonComments {...props} />);
				if ( props['edit'] )
					Right.push(<FooterButtonEdit {...props} />);

				Footer = (
					<footer class={cN('footer', (Left.length + Right.length) ? '-has-items' : '')}>
						<section class="left">{Left}</section>
						<section class="right">{Right}</section>
					</footer>
				);
			}

			return (
				<article class={cN("content -base -common", (minimized ? "-minimized" : null), (editing ? "-edit" : null), props.class)}>
					{props.children}
					{Footer}
				</article>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
