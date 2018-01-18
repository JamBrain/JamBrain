import Util from './Util';
import marked from './marked';

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: {exec: function(){}},
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: {exec: function(){}},
  text: /^[\s\S]+?(?=[\\<!\[_*`:@]| {2,}\n|$)/, // Added : and @ (emoji and @names)
  emoji: /^:([a-z_0-9]+):/,
  email:  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/i,
  atname: /^@([A-Za-z0-9-]+)(?!@)/,

  ///^(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z0-9]+)/,
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = Util.replace(inline.link)('inside', inline._inside)('href', inline._href)();

inline.reflink = Util.replace(inline.reflink)('inside', inline._inside)();

/**
 * Normal Inline Grammar
 */

inline.normal = Util.merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = Util.merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = Util.merge({}, inline.normal, {
  escape: Util.replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: Util.replace(inline.text)(']|', '~]|')('|', '|https?://|')()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = Util.merge({}, inline.gfm, {
  br: Util.replace(inline.br)('{2,}', '*')(),
  text: Util.replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

export default class InlineLexer {
  constructor(links, options) {
    this.options = options || marked.defaults();
    this.links = links;
    this.rules = inline.normal;
    this.renderer = this.options.renderer || new Renderer(this.options);

    if (!this.links) {
      throw new
      Error('Tokens array requires a `links` property.');
    }

    if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline.breaks;
      } else {
        this.rules = inline.gfm;
      }
    } else if (this.options.pedantic) {
      this.rules = inline.pedantic;
    }
  }

  /**
   * Static Lexing/Compiling Method
   */
  static output(src, links, options) {
    var inline = new InlineLexer(links, options);
    return inline.output(src);
  }

  /**
   * Lexing/Compiling
   */
  output(src) {
    var out = [],
      link,
      text,
      href,
      cap;

    while (src) {

	// escape
      if (cap = this.rules.escape.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(cap[1]);
        continue;
      }

      // mail
      if (cap = this.rules.email.exec(src)) {
        src = src.substring(cap[0].length);
		leftSide = cap[1];
		rightSide = cap[cap.lastIndexOf(undefined) + 1];
		text = cap[0];
        out.push(this.renderer.mail(leftSide, rightSide, text));
        continue;
      }

      // autolink
      if (cap = this.rules.autolink.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[2] === '@') {
          text = cap[1].charAt(6) === ':'
            ? this.mangle(cap[1].substring(7))
            : this.mangle(cap[1]);
          href = this.mangle('mailto:') + text;
        } else {
          text = Util.escape(cap[1]);
          href = text;
        }
        out.push(this.renderer.link(href, null, text));
        continue;
      }

      // url (gfm)
      if (!this.inLink && (cap = this.rules.url.exec(src))) {
        src = src.substring(cap[0].length);
        text = Util.escape(cap[1]);
        href = text;
        out.push(this.renderer.link(href, null, text));
        continue;
      }

      // tag
      if (cap = this.rules.tag.exec(src)) {
        if (!this.inLink && /^<a /i.test(cap[0])) {
          this.inLink = true;
        } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
          this.inLink = false;
        }
        src = src.substring(cap[0].length);
        out.push(this.options.sanitize
          ? this.options.sanitizer
            ? this.options.sanitizer(cap[0])
            : Util.escape(cap[0])
          : cap[0]);
        continue;
      }

      // link
      if (cap = this.rules.link.exec(src)) {
        src = src.substring(cap[0].length);
        this.inLink = true;
        out.push(this.outputLink(cap, {
          href: cap[2],
          title: cap[3]
        }));
        this.inLink = false;
        continue;
      }

      // reflink, nolink
      if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
        src = src.substring(cap[0].length);
        link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
        link = this.links[link.toLowerCase()];
        if (!link || !link.href) {
          out.push(cap[0].charAt(0));
          src = cap[0].substring(1) + src;
          continue;
        }
        this.inLink = true;
        out.push(this.outputLink(cap, link));
        this.inLink = false;
        continue;
      }

      // strong
      if (cap = this.rules.strong.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.strong(this.output(cap[2] || cap[1])));
        continue;
      }

      // em
      if (cap = this.rules.em.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.em(this.output(cap[2] || cap[1])));
        continue;
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.codespan(Util.escape(cap[2], true)));
        continue;
      }

      // br
      if (cap = this.rules.br.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.br());
        continue;
      }

      // del (gfm)
      if (cap = this.rules.del.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.del(this.output(cap[1])));
        continue;
      }

      // emoji
      if (cap = this.rules.emoji.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.emoji(this.output(cap[2] || cap[1])));
        continue;
      }

      // @names
      if (cap = this.rules.atname.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.atname(this.output(cap[2] || cap[1])));
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {

		//Text is too aggressive so we only parse it until first space in case
		//there's an email comming in the text
		l = cap[0].indexOf(' ');
		if (l === -1) {
			l = cap[0].length;
		} else {
			l ++;
		}
        src = src.substring(l);
        out.push(this.renderer.text(Util.escape(this.smartypants(cap[0].substring(0, l)))));
        continue;
      }

      if (src) {
        throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return out;
  }

  /**
   * Compile Link
   */
  outputLink(cap, link) {
    var href = Util.escape(link.href),
      title = link.title
        ? Util.escape(link.title)
        : null;

    return cap[0].charAt(0) !== '!'
      ? this.renderer.link(href, title, this.output(cap[1]))
      : this.renderer.image(href, title, Util.escape(cap[1]));
  }

  /**
   * Smartypants Transformations
   */
  smartypants(text) {
    if (!this.options.smartypants)
      return text;
    return text
    // em-dashes
      .replace(/---/g, '\u2014')
    // en-dashes
      .replace(/--/g, '\u2013')
    // opening singles
      .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
      .replace(/'/g, '&rsquo;')
    //    .replace(/'/g, '\u2019')
    // opening doubles
      .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
      .replace(/"/g, '\u201d')
    // ellipses
      .replace(/\.{3}/g, '\u2026');
  }

  //" //UltraEdit Glitch

  /**
   * Mangle Links
   */
  mangle(text) {
    if (!this.options.mangle)
      return text;
    var out = '',
      l = text.length,
      i = 0,
      ch;

    for (; i < l; i++) {
      ch = text.charCodeAt(i);
      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16);
      }
      out += '&#' + ch + ';';
    }

    return out;
  }

}
