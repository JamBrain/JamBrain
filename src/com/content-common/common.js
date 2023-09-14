import {Component} from 'preact';
import './common.less';

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
			'minimized': false // (props.minimized !== undefined) ? true : false
		};

		this.onMinMax = this.onMinMax.bind(this);
	}

	onMinMax() {
		this.setState(prevState => ({'minimized': !prevState.minimized}));
	}

	render( props, state ) {
		let {node, user, path, extra, editing} = props;
		let {minimized, error} = state;

		// If a Minimized property was included, invert the internal state
		if ( props.minimized ) {
			minimized = !minimized;
		}

		if ( node && node.slug ) {
//			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };


			let Footer = null;
			if ( !props.nofooter ) {
				let Left = [];
				if ( props['minmax'] ) {
					Left.push(<FooterButtonMinMax {...props} onClick={this.onMinMax} />);
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
					<footer class={`footer ${(Left.length + Right.length) ? '-has-items' : ''}`}>
						<section class="left">{Left}</section>
						<section class="right">{Right}</section>
					</footer>
				);
			}

			return (
				<article class={`content -common ${(minimized ? "-minimized" : '')} ${(editing ? "-edit" : '')} ${props.class ?? ''}`}>
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
