import { Component } from 'preact';
import './headliner.less';

import {getLocaleDate, getRoughAge} from 'internal/time';

import {Icon, Button, Tooltip} from 'com/ui';

//import $Node from 'backend/js/node/node';

/** @deprecated */
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
					<Tooltip text="Love" class="-statistic -block">
						<Icon class="-small -baseline" src="heart" /> <span>{node.love}</span>
					</Tooltip>
				);
			}

			if ( props.comments ) {
				Subtext.push(
					<Tooltip text="Comments" class="-statistic">
						<Icon class="-small -baseline" src="bubble" /> <span>{node.comments}</span>
					</Tooltip>
				);
			}

			if ( props.games && node.games ) {
				Subtext.push(
					<Tooltip text="Games" class="-statistic">
						<Icon class="-small -baseline" src="gamepad" /> <span>{node.games}</span>
					</Tooltip>
				);
			}

			if ( props.articles && node.articles ) {
				Subtext.push(
					<Tooltip text="Articles" class="-statistic">
						<Icon class="-small -baseline" src="article" /> <span>{node.articles}</span>
					</Tooltip>
				);
			}


			let Body = null;
			if ( Subtext.length ) {
				Body = (
					<div class="-top-bot">
						<div class="-title _font2">{Title}</div>
						<div class="-subtext">{Subtext}</div>
					</div>
				);
			}
			else {
				Body = (
					<div class="-fill">
						<div class="-title _font2">{Title}</div>
					</div>
				);
			}


			// Render
			return <Button class={`item -list-item ${props.childclass ?? ''}`} href={node.path}>{Body}</Button>;
		}
		return null;
	}


	renderNullItem() {
		let props = this.props;

		let Body = (
			<div class="-fill">
				<div class="-title _font2">{props.title}</div>
			</div>
		);

		return <div class={`item -list-item ${props.childclass ?? ''}`}>{Body}</div>;
	}


	renderItems( node ) {
		if ( !node ) {
			return this.renderNullItem();
		}
		else if ( Array.isArray(node) ) {
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
			if ( (show_new_for_minutes !== null) && (pub_diff < (show_new_for_minutes*60*1000)) ) {
				ret.push(<span class="-label">NEW</span>);
				ret.push(' ');
			}

			ret.push(<span>{label}</span>);
			ret.push(' ');
			ret.push(<Tooltip text={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</Tooltip>);

			// x minutes ago
			return <div>{ret}</div>;
		}
		else {
			return <div>not {label} yet</div>;
		}
	}


	renderFlag( props ) {
		// Build the flag
		let Flag = [];
		// The Icon
		if ( props.icon ) {
			Flag.push(<Icon class="-big" src={props.icon} />);
		}
		// The Name
		if ( props.name ) {
			// If there's an icon, optionally hide the name if sidebar is hidden
			let NameClass = `-text ${props.icon ? '_inline_if-sidebar' : ''}`;
			// Add name text
			Flag.push(<span class={NameClass}>{props.name.toUpperCase()}</span>);
		}

		// Only show the flag if it contains something
		return Flag.length ? <Button class={`flag ${props.flagclass ?? ''}`} href={props.href}>{Flag}</Button> : null;
	}


	renderFooter( props ) {
		// Show the footer
		if ( props.footer ) {
			return <Button class={`item -footer-item ${props.childclass ?? ''}`} href={props.footerhref}>{props.footer}</Button>;
		}
		// Show the more footer
		else if ( props.more ) {
			return (
				<Button class={`item -more-item ${props.childclass ?? ''}`} href={props.more}>
					<Icon src="circle" /><Icon src="circle" /><Icon src="circle" />
				</Button>
			);
		}
	}


	render( props ) {
		let Flag = this.renderFlag(props);
		let Items = this.renderItems(props.node);
		let Footer = this.renderFooter(props);

		// Render
		return <header class={`content -headliner ${props.class ?? ''}`} style={props.style}>{Flag}{Items}{Footer}</header>;
	}
}
