import {h, Component} from 'preact';
import cN from 'classnames';

import {UIIcon, UIButton} from 'com/ui';

/**
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 * @param {string} [props.title]
 * @param {string} [props.name]
 * @param {string} [props.icon]
 * @param {string} [props.flagclass]
 * @param {string} [props.href]
 * @param {string} [props.title]
*/
export default class ContentHeadliner extends Component {
	constructor( props ) {
		super(props);
	}


	renderItem( props ) {
		return (
			<UIButton class={cN("item -list-item", props.childclass)}>
				<div class="-fill">
					<div class="-title _font2">{props.title ? props.title : null}</div>
				</div>
			</UIButton>
		);
	}


	renderFlag( props ) {
		// Build the flag
		let Flag = [];
		// The Icon
		if ( props.icon ) {
			Flag.push(<UIIcon big>{props.icon}</UIIcon>);
		}
		// The Name
		if ( props.name ) {
			// If there's an icon, optionally hide the name if sidebar is hidden
			let NameClass = cN('-text', props.icon ? 'if-sidebar-inline' : '');
			// Add name text
			Flag.push(<span class={NameClass}>{props.name.toUpperCase()}</span>);
		}

		// Only show the flag if it contains something
		return Flag.length ? <UIButton class={cN("flag", props.flagclass)} href={props.href}>{Flag}</UIButton> : null;
	}


	renderFooter( props ) {
		// Show the footer
		if ( props.footer ) {
			return <UIButton class={cN("item -footer-item", props.childclass)} href={props.footerhref}>{props.footer}</UIButton>;
		}
		// Show the more footer
		else if ( props.more ) {
			return (
				<UIButton class={cN("item -more-item", props.childclass)} href={props.more}>
					<UIIcon>circle</UIIcon><UIIcon>circle</UIIcon><UIIcon>circle</UIIcon>
				</UIButton>
			);
		}
	}


	render( props ) {
		let Flag = this.renderFlag(props);
		let Items = this.renderItem(props);
		let Footer = this.renderFooter(props);

		// Render
		return <header class={cN('content -headliner', props.class)} style={props.style}>{Flag}{Items}{Footer}</header>;
	}
}
