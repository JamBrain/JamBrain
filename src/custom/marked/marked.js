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

  setOptions(opt) {
    Util.merge(this.constructor.defaults(), opt);
    this.options = Util.merge(this.constructor.defaults(), opt);

    console.log(this.options);
  }
}
