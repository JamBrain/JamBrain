import {h, Component} 					from 'preact/preact';

import SVGIcon							from 'com/svg-icon/icon';
import ButtonLink						from 'com/button-link/link';

//import $Node							from 'shrub/js/node/node';

export default class ContentHeadliner extends Component {
	constructor( props ) {
		super(props);
	}

	renderItem( node ) {
		if ( node ) {
			// TODO: Figure out if subtext should be shown
			let ShowSubtext = (<div class="-subtext">subtext</div>);

			return (
				<ButtonLink class="-item" href="/batman">
					<div class="-text">Headline Text</div>
					{ShowSubtext}
				</ButtonLink>
			);
		}
		return null;
	}

	renderItems( node ) {
		if ( Array.isArray(node) ) {
			let ret = [];
			for ( let idx = 0; idx < node.length; idx++ ) {
				ret.push(this.renderItem(node[idx]));
			}
			return ret;
		}
		else {
			return this.renderItem(node);
		}
	}

	render( props, state ) {
		let {node} = props;

		let ShowMore = null;
		if ( true ) {
			ShowMore = (
				<ButtonLink class="-item -more" href="/news">
					<SVGIcon>circle</SVGIcon><SVGIcon>circle</SVGIcon><SVGIcon>circle</SVGIcon>
				</ButtonLink>
			);
		}

		// <SVGIcon middle>news</SVGIcon>

		if ( node ) {
			return (
				<div class={cN('content-base content-headliner', props.class)}>
					<ButtonLink class="-name" href="/news"><span>NEWS</span></ButtonLink>
					{this.renderItems(node)}
					{ShowMore}
				</div>
			);
		}
		return null;
	}
}
