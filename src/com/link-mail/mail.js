import './mail.less';

import {Icon} from 'com/ui';

// MK TODO: Migrate me to <Link />
// TODO: obfuscate this somehow so it's not so easy to scrape

export default function LinkMail( props ) {
	let {href, ...otherProps} = props;// || (props.children && props.children.length && props.children[0]) || "";
	let mail = '???';

	if ( href.startsWith('mailto:') ) {
		mail = href.slice(7); // strlen('mailto:')
	}
	else {
		mail = href;
		href = 'mailto:' + href;
	}

	return <a class={`link-mail ${props.class ?? ''}`} href={href} title={mail}><Icon class="-gap -small -baseline" src=">mail" />{mail}</a>;
}
