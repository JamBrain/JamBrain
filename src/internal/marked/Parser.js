import Util from './Util';
import Renderer from './Renderer';
import InlineLexer from './InlineLexer';
import marked from './marked';

export default class Parser {
  /**
   * Constructor
   */
  constructor(options) {
    this.tokens = [];
    this.token = null;
    this.options = options || marked.defaults();
    this.options.renderer = this.options.renderer || new Renderer(this.options);
    this.renderer = this.options.renderer;
  }

  /**
   * Static Parse Method
   */
  static parse(src, options, renderer) {
    var parser = new Parser(options, renderer);
    return parser.parse(src);
  };

  /**
   * Parse Loop
   */
  parse(src) {
    this.inline = new InlineLexer(src.links, this.options, this.renderer);
    this.tokens = src.reverse();

    var out = [];
    while (this.next()) {
      out.push(this.tok());
    }

    return out;
  }

  /**
   * Next Token
   */
  next() {
    return this.token = this.tokens.pop();
  }

  /**
   * Preview Next Token
   */
  peek() {
    return this.tokens[this.tokens.length - 1] || 0;
  }

  /**
   * Parse Text Tokens
   */
  parseText() {
    var body = this.token.text;

    while (this.peek().type === 'text') {
      body += '\n' + this.next().text;
    }

    return this.inline.output(body);
  }

  /**
   * Parse Current Token
   */
  tok() {
    switch (this.token.type) {
      case 'space':
        {
          return '';
        }
      case 'hr':
        {
          return this.renderer.hr();
        }
      case 'heading':
        {
          return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
        }
      case 'code':
        {
          return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
        }
      case 'table':
        {
          var header = [],
            body = [],
            i,
            row,
            cell,
            flags,
            j;

          // header
          cell = [];
          for (i = 0; i < this.token.header.length; i++) {
            flags = {
              header: true,
              align: this.token.align[i]
            };
            cell.push(this.renderer.tablecell(this.inline.output(this.token.header[i]), {
              header: true,
              align: this.token.align[i]
            }));
          }
          header.push(this.renderer.tablerow(cell));

          for (i = 0; i < this.token.cells.length; i++) {
            row = this.token.cells[i];

            cell = [];
            for (j = 0; j < row.length; j++) {
              cell.push(this.renderer.tablecell(this.inline.output(row[j]), {
                header: false,
                align: this.token.align[j]
              }));
            }

            body.push(this.renderer.tablerow(cell));
          }
          return this.renderer.table(header, body);
        }
      case 'spoiler_start':
        {
          var body = [];

          while (this.next().type !== 'spoiler_end') {
            body.push(this.tok());
          }

          return this.renderer.spoiler(body);
        }
      case 'blockquote_start':
        {
          var body = [];

          while (this.next().type !== 'blockquote_end') {
            body.push(this.tok());
          }

          return this.renderer.blockquote(body);
        }
      case 'list_start':
        {
          var body = [],
            ordered = this.token.ordered;

          while (this.next().type !== 'list_end') {
            body.push(this.tok());
          }

          return this.renderer.list(body, ordered);
        }
      case 'list_item_start':
        {
          var body = [];

          while (this.next().type !== 'list_item_end') {
            body.push(this.token.type === 'text'
              ? this.parseText()
              : this.tok());
          }

          return this.renderer.listitem(body);
        }
      case 'loose_item_start':
        {
          var body = [];

          while (this.next().type !== 'list_item_end') {
            body.push(this.tok());
          }

          return this.renderer.listitem(body);
        }
      case 'html':
        {
          var html = !this.token.pre && !this.options.pedantic
            ? this.inline.output(this.token.text)
            : this.token.text;
          return this.renderer.html(html);
        }
      case 'paragraph':
        {
          return this.renderer.paragraph(this.inline.output(this.token.text));
        }
      case 'text':
        {
          return this.renderer.paragraph(this.parseText());
        }
    }
  }
}
