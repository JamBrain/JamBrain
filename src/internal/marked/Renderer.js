import {h} 					from 'preact/preact';

import Util					from './Util';

//COMPONENT IMPORTS
import LinkMail				from 'com/link-mail/mail';		// TODO: Obsolete me
import NavLink 				from 'com/nav-link/link';
import SmartLink 			from 'com/autoembed/smartlink';
import LocalLink			from 'com/autoembed/locallink';

import SmartDomains			from 'com/autoembed/smartdomains';

import BlockSpoiler 		from 'com/block-spoiler/spoiler';
import UIEmbedOverlay 		from "com/ui/embed/overlay/overlay";

export default class Renderer {
	constructor( options ) {
		this.options = options || {};
	}

	code( code, lang, escaped ) {
		if (this.options.highlight) {
			var out = this.options.highlight(code, lang);
			if (out != null && out !== code) {
				escaped = true;
				code = out;

				return (<pre><code class={this.options.langPrefix + escape(lang, true)} dangerouslySetInnerHTML={{"__html": out}}></code></pre>);
			}
		}

		if ( !lang ) {
			return (
				<pre class="language-"><code>{(escaped
					? code
					: Util.escape(code, true))}</code></pre>
			);
		}

		return (
			<pre><code class={this.options.langPrefix + escape(lang, true)}>
				{(escaped ? code : Util.escape(code, true))}
			</code></pre>
		);
	}

	spoiler( secret ) {
		return (
			<BlockSpoiler>{secret}</BlockSpoiler>
		);
	}

	blockquote( quote ) {
		return (
			<blockquote>{quote}</blockquote>
		);
	}

	html( html ) {
		return {html};
	}

	heading( text, level, raw ) {
		const HeaderTag = `h${level}`;
		return (
			<HeaderTag id={this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-').replace(/-$/, "")}>{text}</HeaderTag>
		);
	}

	hr( ) {
		return (<hr/>);
	}

	list( body, ordered ) {
		var Type = ordered
			? 'ol'
			: 'ul';
		return (
			<Type>{'\n'}{body}</Type>
		);
	}

	listitem( text ) {
		return (
			<li>{text}</li>
		);
	}

	paragraph( text ) {
		return (
			<p>{text}</p>
		);
	}

	table( header, body ) {
		return (
			<table>
				<thead>{header}</thead>
				<tbody>{body}</tbody>
			</table>
		);
	}

	tablerow( content ) {
		return (
			<tr>{content}</tr>
		);
	}

	tablecell( content, flags ) {
		var Type = flags.header
			? 'th'
			: 'td';
		return (
			<Type style={"text-align:" + flags.align
				? flags.align
				: ''}>{content}</Type>
		);
	}

	// span level renderer
	strong( text ) {
		return (
			<strong>{text}</strong>
		);
	}

	em( text ) {
		return (
			<em>{text}</em>
		);
	}

	emoji( text ) {
		text = Array.isArray(text) ? text.join('') : text;
		let shortname = window.emoji.shortnameToURL(text);
		if ( shortname ) {
			return <img class="emoji" alt={text} title={':'+text+':'} src={shortname} />;
		}
		return ':'+text+':';
	}

	//email(text) {
	//  return 'VEOO'+text+'OOEV';
	//};

	atname( text ) {
		return (
			<NavLink href={"/users/" + text}>@{text}</NavLink>
		);
	}

	codespan( text ) {
		return (
			<code>{Util.htmldecode(text)}</code>
		);
		// text.replace('\n','') // ??
	}

	br( ) {
		//    if(this.options.xhtml) {
		return (<br/>);
		// } else {
		//   return (<br>);
		// }

	}

	del( text ) {
		return (
			<del>{text}</del>
		);
	}

	linkDomain( domain ) {
		let parent = SmartDomains.find((element) => {
			return element.domain == domain.parent;
		});


		if(parent.parent) {
			parent = this.linkDomain(parent);
		}

		return {...parent, ...domain};
	}

	parseLink( href ) {

		if ( href.indexOf('///') == 0 ) {
			// static domain link, something on our static server
			return {"type": "static"};
		}
		else if ( href.indexOf('//') == 0 ) {
			// same protocol link, use the current protocol to link to anothor site
			return {"type": "protocol"};
		}
		else if ( href.indexOf('/') == 0 ) {
			// relative domain link
			return {"type": "relative"};
		}
		else if ( href.indexOf('#/') === 0 ) {
			return {"type": "local"};
		}

		url = extractFromURL(href);

		if ( url.domain ) {

			if ( SmartDomains ) {

				for ( var i=0; i < SmartDomains.length; i++ ) {
					let smartdomain = SmartDomains[i];

					if ( url.domain.indexOf(smartdomain.domain) !== -1 ) {

						if ( smartdomain.embed_test ) {

							let test = new RegExp(smartdomain.embed_test);
							let match = test.exec(url.href);

							if ( match !== null ) {
								// embedable domain found, will embed this content in the page.
								let info = smartdomain;

								if( smartdomain.parent ) {
									info = this.linkDomain(smartdomain);
								}

								return {"type": "embed", "match": match[1], "info": info, "url": url.href};
							}
						}
						// smart but none embedable domain found, these get icons next to them
						return {"type": "smart", "info": smartdomain};
					}
				}
			}

			// "simple link", no special behaviour
			return {"type": "simple"};
		}

		// We tried to parse something that dosen't apear to be a link
		console.warn("unable to parse href ", url.href);
		return null;
	}

	link( href, title, text ) {
		if ( this.options.sanitize ) {

			try {
				var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
			}
			catch (e) {
				return '';
			}

			if ( 	prot.indexOf('javascript:')	=== 0 ||
					prot.indexOf('vbscript:')	=== 0 ||
					prot.indexOf('data:')		=== 0 ) {
				return '';
			}
		}

		href = extractFromURL(href).href;

		// If text is blank, use the URL itself
		let hasText = text && (text.length > 0);
		let joinedText = Array.isArray(text) ? text.join("") : text;

		let result = this.parseLink(href);

		if ( result == null ) {
			// wasn't a link
			console.warn("Could not parse link", href);
			return "";
		}

		if ( result.type == "simple" ) {
			hasText = hasText && !/^\s+$/.test(text); // make sure the link isn't all whitespace too
			return <NavLink href={href} title={title} target={"_blank"}>{(hasText) ? text : href}</NavLink>;
		}
		else if ( result.type == "smart" ) {
			hasText = hasText && !/^\s+$/.test(joinedText); // make sure the link isn't all whitespace too
			let partial = href.substring(href.indexOf(result.info.domain) + result.info.domain.length);
			return <SmartLink icon_name={result.info.icon_name} full_url={href} domain={(hasText) ? "" : result.info.domain} part_url={(hasText) ? text : partial}></SmartLink>;
		}
		else if ( result.type == "embed" ) {
			if(result.info.heavy) {
				return <UIEmbedOverlay link={result} title={title} text={(hasText) ? text : href} />;
			} else {
				return <result.info.component link={result} title={title} text={(hasText) ? text : href} />;
			}

		}
		else if ( result.type == "relative" ) {
			return <LocalLink href={href} text={(hasText) ? text : href} title={title} target={"_blank"}/>;
		}
		else if ( result.type == "local" ) {
			return <LocalLink href={href} text={(hasText) ? text : href} title={title} hashLink />;
		}
		else if ( result.type == "protocol" ) {
			hasText = hasText && !/^\s+$/.test(joinedText); // make sure the link isn't all whitespace too
			return <NavLink href={href} text={(hasText) ? joinedText : href.substr(2)} title={title} target={"_blank"}/>;
		}
		else if ( result.type == "static" ) {
			hasText = hasText && !/^\s+$/.test(joinedText); // make sure the link isn't all whitespace too
			return <NavLink href={"//" + STATIC_DOMAIN + href.substr(2)} text={(hasText) ? joinedText : (STATIC_DOMAIN + href.substr(2))} title={title} target={"_blank"}/>;
		}
	}

	mail( leftSide, rightSide, text ) {
		href = '{0}@{1}'.replace('{1}', rightSide, 1).replace('{0}', leftSide, 1);
		if ( this.options.sanitize ) {
			try {
				var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
			}
			catch (e) {
				return '';
			}
			if (	prot.indexOf('javascript:')	=== 0 ||
					prot.indexOf('vbscript:')	=== 0 ||
					prot.indexOf('data:')		=== 0 ) {
				return '';
			}
		}

		//text = leftSide + '[at]' + rightSide;

		var out = (
			<LinkMail href={href} title={text}>{text}</LinkMail>
		);

		return out;

	}

	image( href, title, text ) {
		// Customized. Disable image rendering if URLs are used to files not on our safe list.
		// Also, rewrite URLs to our static domain if the short form is used.

		if ( href.indexOf("///") === 0 ) {
		// Rewrite URL to replace the first two slashes with the endpoint
			href = STATIC_ENDPOINT + href.substr(2);
		}
		// Disabled this. Only Triple slash URLs should be allow.
		//  else if ( href.indexOf(STATIC_ENDPOINT) >= 0 && href.indexOf(STATIC_ENDPOINT) <= 5 ) {
		//  	// Everything is okay. Use this URL as-is
		//  }
		else {
			//return '<div class="unsafe-image-url">' + text + '</div>';
			href = STATIC_ENDPOINT + '/content/internal/pleaseupload.png';
		}
		var out = (<img class="img" src={href} alt={text} title={title}/>);
		/*if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml
      ? '/>'
      : '>';*/
		return out;
	}

	text( text ) {
		return (Util.htmldecode(text));
	}
}
