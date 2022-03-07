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
			// Build Title
			let Title = [];
			Title.push(<span class="-main">{node.name}</span>);


			// Build Subtext
			let Subtext = [];

			if ( props.published ) {
				Subtext.push(this.renderWhen(node, (typeof props.published == 'string') ? props.published : 'published'));
			}

			if ( props.love ) {
				Subtext.push(
					<div title="Love" class="-statistic">
						<SVGIcon small baseline>heart</SVGIcon> <span>{node.love}</span>
					</div>
				);
			}

			if ( props.comments ) {
				Subtext.push(
					<div title="Comments" class="-statistic">
						<SVGIcon small baseline>bubble</SVGIcon> <span>{node.comments}</span>
					</div>
				);
			}

			if ( props.games && node.games ) {
				Subtext.push(
					<div title="Games" class="-statistic">
						<SVGIcon small baseline>gamepad</SVGIcon> <span>{node.games}</span>
					</div>
				);
			}

			if ( props.articles && node.articles ) {
				Subtext.push(
					<div title="Articles" class="-statistic">
						<SVGIcon small baseline>article</SVGIcon> <span>{node.articles}</span>
					</div>
				);
			}


			// Render
			if ( Subtext.length ) {
				return (
					<ButtonLink class="item -list-item" href={node.path}>
						<div class="-top-bot">
							<div class="-title _font2">{Title}</div>
							<div class="-subtext">{Subtext}</div>
						</div>
					</ButtonLink>
				);
			}
			else {
				return (
					<ButtonLink class="item -list-item" href={node.path}>
						<div class="-fill">
							<div class="-title _font2">{Title}</div>
						</div>
					</ButtonLink>
				);
			}
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

	renderWhen( node, label, show_new_for_minutes = 24*60 ) {
		if ( node.published ) {
			let date_pub = new Date(node.published);
			if ( node.meta['origin-date'] ) {
				date_pub = new Date(node.meta['origin-date']);
			}
			let date_now = new Date();
			let pub_diff = (date_now.getTime() - date_pub.getTime());// - (date_now.getTimezoneOffset()*60);

			let ret = [];

			// Optionally include [NEW] label
			if ( (show_new_for_minutes !== null) && (pub_diff < (parseInt(show_new_for_minutes)*60*1000)) ) {
				ret.push(<span class="-label">NEW</span>);
				ret.push(' ');
			}

			ret.push(<span>{label}</span>);
			ret.push(' ');
			ret.push(<span title={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</span>);

			// x minutes ago
			return <div>{ret}</div>;
		}
		else {
			return <div>not {label} yet</div>;
		}
	}

	render( props ) {
		let {node} = props;


		// Build the corner flag
		let Flag = [];
		// The Icon
		if ( props.icon ) {
			Flag.push(<SVGIcon big>{props.icon}</SVGIcon>);
		}
		// The Name
		if ( props.name ) {
			// Optionally hide the name sidebar is hidden
			let NameClass = cN('-text', props.icon ? 'if-sidebar-inline' : '');
			// Add name text
			Flag.push(<span class={NameClass}>{props.name.toUpperCase()}</span>);
		}


		let ShowCornerFlag = null;
		// Show the flag (if it was built)
		if ( Flag.length ) {
			if ( props.href ) {
				ShowCornerFlag = <ButtonLink class="corner-flag -inv -inv-lit" href={props.href}>{Flag}</ButtonLink>;
			}
			else {
				ShowCornerFlag = <div class="corner-flag -inv">{Flag}</div>;
			}
		}


		let ShowFooter = null;
		// Show the footer
		if ( props.footer ) {
			if ( props.footerhref ) {
				ShowFooter = <ButtonLink class="item -footer-item" href={props.footerhref}>{props.footer}</ButtonLink>;
			}
			else {
				ShowFooter = <div class="item -footer-item">{props.footer}</div>;
			}
		}
		// Show the more footer
		else if ( props.more ) {
			ShowFooter = (
				<ButtonLink class="item -more-item" href={props.more}>
					<SVGIcon>circle</SVGIcon><SVGIcon>circle</SVGIcon><SVGIcon>circle</SVGIcon>
				</ButtonLink>
			);
		}


		// Render
		if ( node ) {
			return (
				<div class={cN('content-base content-headliner', props.class)}>
					{ShowCornerFlag}
					{this.renderItems(node)}
					{ShowFooter}
				</div>
			);
		}
		return null;
	}
}
