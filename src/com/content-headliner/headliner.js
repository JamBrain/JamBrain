import {h, Component} 					from 'preact/preact';

import SVGIcon							from 'com/svg-icon/icon';
import ButtonLink						from 'com/button-link/link';

//import $Node							from 'shrub/js/node/node';

export default class ContentHeadliner extends Component {
	constructor( props ) {
		super(props);
	}

	renderItem( node ) {
		let props = this.props;

		if ( node ) {
			let Subtext = [];

			if ( props.published ) {
				Subtext.push(this.getWhen(node, 'published'));
			}

			if ( props.love ) {
				Subtext.push(<SVGIcon small>heart</SVGIcon>);
				Subtext.push(' ');
				Subtext.push(<span>{node.love}</span>);
			}

			if ( props.comments ) {
				Subtext.push(<SVGIcon small>bubble</SVGIcon>);
				Subtext.push(' ');
				Subtext.push(<span>{node.notes}</span>);
			}

			return (
				<ButtonLink class="-item" href={node.path}>
					<div class="-text _font2">{node.name}</div>
					<div class="-subtext">{Subtext}</div>
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

	getWhen( node, label ) {
		if ( node.published ) {
			let date_pub = new Date(node.published);
			if ( node.meta['origin-date'] ) {
				date_pub = new Date(node.meta['origin-date']);
			}
			let date_now = new Date();
			let pub_diff = (date_now.getTime() - date_pub.getTime());// - (date_now.getTimezoneOffset()*60);

			let ret = [];

			// TODO: optionally include [NEW] label if <24 hours old
			if ( pub_diff < 24*60*60*1000 ) {
				ret.push(<span class="-label -inv">NEW</span>);
				ret.push(' ');
			}

			ret.push(<span>{label}</span>);
			ret.push(' ');
			ret.push(<span title={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</span>);

			// x minutes ago
			return ret;
		}
		else {
			return <span>not {label} yet</span>;
		}
	}

	render( props ) {
		let {node} = props;

		let ShowMore = null;
		if ( props.more ) {
			ShowMore = (
				<ButtonLink class="-item -more" href={props.more}>
					<SVGIcon>circle</SVGIcon><SVGIcon>circle</SVGIcon><SVGIcon>circle</SVGIcon>
				</ButtonLink>
			);
		}

		let Name = [];
		let NameClass = cN('-text', props.icon ? 'if-sidebar-inline' : '');
		if ( props.icon ) {
			Name.push(<SVGIcon>{props.icon}</SVGIcon>);
			Name.push(' ');
		}
		Name.push(<span class={NameClass}>{props.name.toUpperCase()}</span>);

		let ShowName = null;
		if ( props.href )
			ShowName = <ButtonLink class="-name" href={props.href}>{Name}</ButtonLink>;
		else
			ShowName = <div class="-name">{Name}</div>;

		if ( node ) {
			return (
				<div class={cN('content-base content-headliner', props.class)}>
					{ShowName}
					{this.renderItems(node)}
					{ShowMore}
				</div>
			);
		}
		return null;
	}
}
