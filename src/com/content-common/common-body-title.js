import {h} from 'preact';
import cN from 'classnames';

import {UILink, UIIcon} from 'com/ui';
import InputText from 'com/input-text/text';
import BodyLabel from "./body/body-label";


export function BodyTitle( props ) {
	let titlePrefix = props.titleIcon ? (<UIIcon baseline small class="prefix" src={props.titleIcon} />) : null;
	let titleText = props.title ? props.title : "Untitled";

	let titleBody = props.href ?
		<UILink class="title" href={props.href} title={props.tooltip}>{titlePrefix}{titleText}</UILink> :
		<span class="title" title={props.tooltip}>{titlePrefix}{titleText}</span>;

	return (
		<div class={cN("body -title _font2", props.class)}>
			{titleBody}
			{props.children}
		</div>
	);
}

export default function BodyTitleEditable( props ) {
	if ( props.editing ) {
		let placeholderTitle = props.placeholder ? props.placeholder : "Title";
		let titleLimit = props.limit ? props.limit : 64;

		return (
			<div class={cN("body -title", props.class, "-editing")}>
				<BodyLabel>Title</BodyLabel>
				<InputText
					value={props.title}
					onModify={props.onModify}
					placeholder={placeholderTitle}
					maxLength={titleLimit}
				/>
			</div>
		);
	}

	return <BodyTitle {...props} />;
}

/*
export default class ContentCommonBodyTitle extends Component {
	constructor( props ) {
		super(props);
	}

//	shouldComponentUpdate( nextProps ) {
//		return shallowDiff(this.props.children, nextProps.children);
//	}

	render( props ) {
		let placeholderTitle = props.placeholder ? props.placeholder : "Untitled";

		if ( props.editing ) {
			let titleLimit = props.limit ? props.limit : 64;

			return (
				<div class={cN("body -title -editing", props.class)}>
					<BodyLabel>Title</BodyLabel>
					<InputText
						value={props.title}
						onModify={props.onModify}
						placeholder={placeholderTitle}
						maxLength={titleLimit}
					/>
				</div>
			);
		}
		else {
			let titleClass = cN("body -title", props.subtitle ? " -has-subtitle" : null, " _font2");
			let titlePrefix = props.titleIcon ? <UIIcon baseline small class="prefix" src={props.titleIcon} /> : null;
			var titleText = props.title ? props.title : placeholderTitle;

			var Body = [];
			if ( props.href ) {
				Body.push(<UILink class="title" href={props.href} title={props.tooltip}>{titlePrefix}{titleText}</UILink>);

				// MK: Shortlink should not be implemented here
				if ( props.shortlink && !props.minmax && props.id ) {
					Body.push(<CopyToClipboardButton title="Copy shortlink to clipboard" icon={"link"} class="shortlink" value={window.location.protocol + "//" + SHORTENER_DOMAIN + "/$" + props.id}></CopyToClipboardButton>);
				}

			}
			else {
				Body.push(<span class="title" title={props.tooltip}>{titlePrefix}{titleText}</span>);
			}


			if ( props.subtitle ) {
				Body.push(<span class="subtitle">{props.subtitle}</span>);
			}


			return <div class={cN(titleClass, props.class)}>{Body}{props.children}</div>;
		}
	}
}
*/
