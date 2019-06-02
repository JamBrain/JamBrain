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

		props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
		props.class.push("content-common-body");
		props.class.push("-title");
		if ( props.subtitle )
			props.class.push("-has-subtitle");

		var Prefix = null;
		if ( props.titleIcon ) {
			Prefix = <SVGIcon baseline small class="-prefix">{props.titleIcon}</SVGIcon>;
		}

		var Limit = props.limit ? props.limit : 64;	// True limit is 96
		var Placeholder = props.placeholder ? props.placeholder : 'Title';

		if (props.editing) {
			props.class.push('-editing');
			return (
				<div class={props.class}>
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
			props.class.push("_font2");

			var Title = props.title.trim().length ? props.title.trim() : Placeholder;
			var Body = [];
			if ( props.href ) {
				Body.push(<NavLink class="-text" href={props.href} title={props.hover}>{Prefix}{Title}</NavLink>);
				if (!props.minmax && props.id) {

					Body.push(<CopyToClipboardButton tooltip="Copy short link to clipboard" icon={"link"} class={"-shortner"} data={SHORTNER_DOMAIN+"/$" + props.id}></CopyToClipboardButton>);
				}
			}
			else {
				Body.push(<div class="-text" title={props.hover}>{Prefix}{Title}</div>);
			}

			if ( props.subtitle ) {
				Body.push(<span class="-subtext"> ({props.subtitle})</span>);
			}

			return <div class={props.class}>{Body}</div>;
		}
	}
}
