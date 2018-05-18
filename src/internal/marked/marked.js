import Lexer from './Lexer';
import Parser from './Parser';
import Renderer from './Renderer';
import Util from './Util';

export default class marked {
  static defaults() {
    return {
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      sanitizer: null,
      mangle: true,
      smartLists: false,
      silent: false,
      highlight: null,
      langPrefix: 'lang-',
      smartypants: false,
      headerPrefix: '',
      renderer: null,
      xhtml: false
    };
  }

  parse(src, opt, callback) {
    this.constructor.defaults().renderer = new Renderer((opt || this.constructor.defaults()));
    if (callback || typeof opt === 'function') {
      if (!callback) {
        callback = opt;
        opt = null;
      }

      opt = Util.merge({}, this.constructor.defaults(), opt || {});

      var highlight = opt.highlight,
        tokens,
        pending,
        i = 0;

      try {
        tokens = Lexer.lex(src, opt);
      } catch (e) {
        return callback(e);
      }

      pending = tokens.length;

      var done = function(err) {
        if (err) {
          opt.highlight = highlight;
          return callback(err);
        }

        var out;

        try {
          out = Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }

        opt.highlight = highlight;

        return err
          ? callback(err)
          : callback(null, out);
      };

      if (!highlight || highlight.length < 3) {
        return done();
      }

      delete opt.highlight;

      if (!pending)
        return done();

      for (; i < tokens.length; i++) {
        (function(token) {
          console.log(token);
          if (token.type !== 'code') {
            return-- pending || done();
          }
          return highlight(token.text, token.lang, function(err, code) {
            if (err)
              return done(err);
            if (code == null || code === token.text) {
              return-- pending || done();
            }
            token.text = code;
            token.escaped = true;
            --pending || done();
          });
        })(tokens[i]);
      }

      return;
    }
    try {
      if (opt)
        opt = Util.merge({}, this.constructor.defaults(), opt);
      return Parser.parse(Lexer.lex(src, opt), opt).map((element, index) => (element));
    } catch (e) {
      if ((opt || this.constructor.defaults()).silent) {
        return (<div><p>An error occured:</p><pre>{Util.escape(e.message + '', true)}</pre></div>);
      }
      throw e;
    }
  }

  static cleanMarkdown(markdown) {
    output = markdown
    //remove code
    .replace(/^( {4}[^\n]+\n*)+/, "")
    //remove tables
    .replace(/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/, "")
    // Remove HTML tags
    .replace(/<(.*?)>/g, '$1')
    // Remove setext-style headers
    .replace(/^[=\-]{2,}\s*$/g, '')
    // Remove footnotes?
    .replace(/\[\^.+?\](\: .*?$)?/g, '')
    .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
    // Remove images
    .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '')
    // Remove inline links
    .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
    // Remove Blockquotes
    .replace(/>/g, '')
    // Remove reference-style links?
    .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
    // Remove atx-style headers
    .replace(/^\#{1,6}\s*([^#]*)\s*(\#{1,6})?/gm, '$1')
    .replace(/([\*_]{1,3})(\S.*?\S)\1/g, '$2')
    .replace(/(`{3,})(.*?)\1/gm, '$2')
    .replace(/^-{3,}\s*$/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\n{2,}/g, '\n\n')
    //emoji
    .replace(/^:([a-z_0-9]+):/, '')
    .replace("\n", " ");

    return output;
  }

  setOptions(opt) {
    Util.merge(this.constructor.defaults(), opt);
    this.options = Util.merge(this.constructor.defaults(), opt);

    console.log(this.options);
  }
}
