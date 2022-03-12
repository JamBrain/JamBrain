import {h, Component} 				from 'preact/preact';
import {shallowDiff}	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

import InputText						from 'com/input-text/text';
import CopyToClipboardButton from '../button-clipboard/clipboard';

export default class ContentCommonBodyTitle extends Component {
	constructor( props ) {
		super(props);
	}

//	shouldComponentUpdate( nextProps ) {
//		return shallowDiff(this.props.children, nextProps.children);
//	}

	render( props ) {
		let titleClass = "body -title";

		if ( props.subtitle )
			titleClass += " -has-subtitle";

		var Prefix = null;
		if ( props.titleIcon ) {
			Prefix = <SVGIcon baseline small class="prefix">{props.titleIcon}</SVGIcon>;
		}

		var Limit = props.limit ? props.limit : 64;	// True limit is 96
		var Placeholder = props.placeholder ? props.placeholder : 'Title';

		if ( props.editing ) {
			titleClass += ' -editing';

			return (
				<div class={cN(titleClass, props.class)}>
					<div class="-label">Title</div>
					<InputText
						value={props.title}
						onmodify={props.onmodify}
						placeholder={Placeholder}
						maxlength={Limit}
					/>
				</div>
			);
		}
		else {
			titleClass += " _font2";

			var Title = props.title.trim().length ? props.title.trim() : Placeholder;
			var Body = [];
			if ( props.href ) {
				Body.push(<NavLink class="title" href={props.href} title={props.hover}>{Prefix}{Title}</NavLink>);
				if ( props.shortlink && !props.minmax && props.id ) {

					Body.push(<CopyToClipboardButton title="Copy shortlink to clipboard" icon={"link"} class="shortlink" value={window.location.protocol + "//" + SHORTENER_DOMAIN + "/$" + props.id}></CopyToClipboardButton>);
				}
			}
			else {
				Body.push(<div class="title" title={props.hover}>{Prefix}{Title}</div>);
			}

			if ( props.subtitle ) {
				Body.push(<span class="subtitle">{props.subtitle}</span>);
			}

			return <div class={cN(titleClass, props.class)}>{Body}</div>;
		}
	}
}
