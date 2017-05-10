import {h} from 'preact/preact';

import Util from './Util';

import BlockSpoiler from 'com/block-spoiler/spoiler';
import MailLink from 'com/content-maillink/maillink';

//COMPONENT IMPORTS
import NavLink from 'com/nav-link/link';
import AutoEmbed from 'com/autoembed/autoembed';

export default class Renderer {
  constructor(options) {
    this.options = options || {};
  }

  code(code, lang, escaped) {
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;

        return (<pre><code class={this.options.langPrefix + escape(lang, true)} dangerouslySetInnerHTML={{ __html: out}}></code></pre>);
      }
    }

    if (!lang) {
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
  };
  spoiler(secret) {
    return (
      <BlockSpoiler>{secret}</BlockSpoiler>
    );
  };
  blockquote(quote) {
    return (
      <blockquote>{quote}</blockquote>
    );
  };

  html(html) {
    return {html};
  };

  heading(text, level, raw) {
    const HeaderTag = `h${level}`;
    return (
      <HeaderTag id={this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-').replace(/-$/, "")}>{text}</HeaderTag>
    );
  };

  hr() {
    return (<hr/>);
  };

  list(body, ordered) {
    var Type = ordered
      ? 'ol'
      : 'ul';
    return (
      <Type>{'\n'}{body}</Type>
    );
  };

  listitem(text) {
    return (
      <li>{text}</li>
    );
  };

  paragraph(text) {
    return (
      <p>{text}</p>
    );
  };

  table(header, body) {
    return (
      <table>
        <thead>{header}</thead>
        <tbody>{body}</tbody>
      </table>
    );
  };

  tablerow(content) {
    return (
      <tr>{content}</tr>
    );
  };

  tablecell(content, flags) {
    var Type = flags.header
      ? 'th'
      : 'td';
    return (
      <Type style={"text-align:" + flags.align
        ? flags.align
        : ''}>{content}</Type>
    );
  };

  // span level renderer
  strong(text) {
    return (
      <strong>{text}</strong>
    );
  };

  em(text) {
    return (
      <em>{text}</em>
    );
  };

  emoji(text) {
    return (<img class="emoji" alt={text} title={':' + text + ':'} src={window.emoji.shortnameToURL(text.join(''))}/>);
  };

  //email(text) {
  //  return 'VEOO'+text+'OOEV';
  //};

  atname(text) {
    return (
      <NavLink href={"/users/" + text}>@{text}</NavLink>
    );
  };

  codespan(text) {
    return (
      <code>{text}</code>
    );
    // text.replace('\n','') // ??
  };

  br() {
    //    if(this.options.xhtml) {
    return (<br/>);
    // } else {
    //   return (<br>);
    // }

  };

  del(text) {
    return (
      <del>{text}</del>
    );
  };

  link(href, title, text) {
    if (this.options.sanitize) {
      try {
        var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
      } catch (e) {
        return '';
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return '';
      }
    }

    href = extractFromURL(href).href;

    var isExternal = href.indexOf('//') != -1;
    var isInternal = href.indexOf('///') === 0;
    if ( isInternal ) {
      isExternal = false;
      href = href.substr(2);
    }

    if ( isExternal ) {
		var target = "_blank";
	}

    // If text is blank, use the URL itself
    if ( !text || text.length < 1 ) {
      text = href;
    }
	
    if(AutoEmbed.hasEmbed(href) || AutoEmbed.hasSmartLink(href)) {
      return (<AutoEmbed href={href} title={title} text={text} />);
    }

    var out = (
      <NavLink href={href} title={title} target={target}>{text}</NavLink>
    );
    return out;

  };
  
  mail(leftSide, rightSide, text) {
	href = '{0}@{1}'.replace('{1}', rightSide, 1).replace('{0}', leftSide, 1);
    if (this.options.sanitize) {
      try {
        var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
      } catch (e) {
        return '';
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return '';
      }
    }

	//text = leftSide + '[at]' + rightSide;

    var out = (
      <MailLink href={href} title={text}>{text}</MailLink>
    );
	
    return out;

  };

  image(href, title, text) {
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
  };

  text(text) {
    return (Util.htmldecode(text));
  };
}
