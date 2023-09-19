import {Component} from 'preact';

import {Icon, Button} from 'com/ui';

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
			<Button class={`item -list-item ${props.childclass ?? ''}`}>
				<div class="-fill">
					<div class="-title _font2">{props.title ? props.title : null}</div>
				</div>
			</Button>
		);
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
			let NameClass = `-text ${props.icon ? 'if-sidebar-inline' : ''}`;
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
				<Button class={`item -more-item ${props.childclass}`} href={props.more}>
					<Icon src="circle" /><Icon src="circle" /><Icon src="circle" />
				</Button>
			);
		}
	}


	render( props ) {
		let Flag = this.renderFlag(props);
		let Items = this.renderItem(props);
		let Footer = this.renderFooter(props);

		// Render
		return <header class={`content -headliner ${props.class ?? ''}`} style={props.style}>{Flag}{Items}{Footer}</header>;
	}
}
