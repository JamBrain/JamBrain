import Util from './Util';
import marked from './marked';

var block = {
	newline: /^\n+/,
	code: /^( {4}[^\n]+\n*)+/,
	fences: {exec: function(){}},
	hr: /^( *[-*_]){3,} *(?:\n+|$)/,
	heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
	nptable: {exec: function(){}},
	lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
	spoiler: /^( *\!>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
	blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
	list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
	html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
	table: {exec: function(){}},
	paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|spoiler|blockquote|tag|def))+)\n*/,
	text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = Util.replace(block.item, 'gm')(/bull/g, block.bullet)();

block.list = Util.replace(block.list)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')();

block.spoiler = Util.replace(block.spoiler)('def', block.def)();

block.blockquote = Util.replace(block.blockquote)('def', block.def)();

block._tag = '(?!(?:' +
		'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' +
		'|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' +
		'|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = Util.replace(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();

block.paragraph = Util.replace(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('spoiler', block.spoiler)('blockquote', block.blockquote)('tag', '<' + block._tag)('def', block.def)();

/**
 * Normal Block Grammar
 */

block.normal = Util.merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = Util.merge({}, block.normal, {
	fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
	paragraph: /^/,
	heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = Util.replace(block.paragraph)('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|')();

/**
 * GFM + Tables Block Grammar
 */

block.tables = Util.merge({}, block.gfm, {
	nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
	table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

export default class Lexer {
	constructor(options) {
		this.tokens = [];
		this.tokens.links = {};
		this.options = options || marked.defaults();
		this.rules = block.normal;

		if (this.options.gfm) {
			if (this.options.tables) {
				this.rules = block.tables;
			} else {
				this.rules = block.gfm;
			}
		}
	}

	/**
   * Static Lex Method
   */
	static lex(src, options) {
		var lexer = new Lexer(options);
		return lexer.lex(src);
	}

	/**
   * Preprocessing
   */
	lex(src) {
		src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');

		return this.token(src, true);
	}

	/**
   * Lexing
   */
	token(src, top, bq) {
		var src = src.replace(/^ +$/gm, ''),
			next,
			loose,
			cap,
			bull,
			b,
			item,
			space,
			i,
			l;

		while (src) {
			// newline
			if (cap = this.rules.newline.exec(src)) {
				src = src.substring(cap[0].length);
				if (cap[0].length > 1) {
					this.tokens.push({type: 'space'});
				}
			}

			// code
			if (cap = this.rules.code.exec(src)) {
				src = src.substring(cap[0].length);
				cap = cap[0].replace(/^ {4}/gm, '');
				this.tokens.push({
					type: 'code',
					text: !this.options.pedantic
						? cap.replace(/\n+$/, '')
						: cap
				});
				continue;
			}

			// fences (gfm)
			if (cap = this.rules.fences.exec(src)) {
				src = src.substring(cap[0].length);
				this.tokens.push({
					type: 'code',
					lang: cap[2],
					text: cap[3] || ''
				});
				continue;
			}

			// heading
			if (cap = this.rules.heading.exec(src)) {
				src = src.substring(cap[0].length);
				this.tokens.push({type: 'heading', depth: cap[1].length, text: cap[2]});
				continue;
			}

			// table no leading pipe (gfm)
			if (top && (cap = this.rules.nptable.exec(src))) {
				src = src.substring(cap[0].length);

				item = {
					type: 'table',
					header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
					align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
					cells: cap[3].replace(/\n$/, '').split('\n')
				};

				for (i = 0; i < item.align.length; i++) {
					if (/^ *-+: *$/.test(item.align[i])) {
						item.align[i] = 'right';
					} else if (/^ *:-+: *$/.test(item.align[i])) {
						item.align[i] = 'center';
					} else if (/^ *:-+ *$/.test(item.align[i])) {
						item.align[i] = 'left';
					} else {
						item.align[i] = null;
					}
				}

				for (i = 0; i < item.cells.length; i++) {
					item.cells[i] = item.cells[i].split(/ *\| */);
				}

				this.tokens.push(item);

				continue;
			}

			// lheading
			if (cap = this.rules.lheading.exec(src)) {
				src = src.substring(cap[0].length);
				this.tokens.push({
					type: 'heading',
					depth: cap[2] === '='
						? 1
						: 2,
					text: cap[1]
				});
				continue;
			}

			// hr
			if (cap = this.rules.hr.exec(src)) {
				src = src.substring(cap[0].length);
				this.tokens.push({type: 'hr'});
				continue;
			}

			// spoiler
			if (cap = this.rules.spoiler.exec(src)) {
				src = src.substring(cap[0].length);

				this.tokens.push({type: 'spoiler_start'});


				cap = cap[0].replace(/^ *\!> ?/gm, '');

				// Pass `top` to keep the current
				// "toplevel" state. This is exactly
				// how markdown.pl works.
				this.token(cap, top, true);

				this.tokens.push({type: 'spoiler_end'});

				continue;
			}

			// blockquote
			if (cap = this.rules.blockquote.exec(src)) {
				src = src.substring(cap[0].length);

				this.tokens.push({type: 'blockquote_start'});


				cap = cap[0].replace(/^ *> ?/gm, '');

				// Pass `top` to keep the current
				// "toplevel" state. This is exactly
				// how markdown.pl works.
				this.token(cap, top, true);

				this.tokens.push({type: 'blockquote_end'});

				continue;
			}

			// list
			if (cap = this.rules.list.exec(src)) {
				src = src.substring(cap[0].length);
				bull = cap[2];

				this.tokens.push({
					type: 'list_start',
					ordered: bull.length > 1
				});

				// Get each top-level item.
				cap = cap[0].match(this.rules.item);

				next = false;
				l = cap.length;
				i = 0;

				for (; i < l; i++) {
					item = cap[i];

					// Remove the list item's bullet
					// so it is seen as the next token.
					space = item.length;
					item = item.replace(/^ *([*+-]|\d+\.) +/, '');

					// Outdent whatever the
					// list item contains. Hacky.
					if (~ item.indexOf('\n ')) {
						space -= item.length;
						item = !this.options.pedantic
							? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
							: item.replace(/^ {1,4}/gm, '');
					}

					// Determine whether the next list item belongs here.
					// Backpedal if it does not belong in this list.
					if (this.options.smartLists && i !== l - 1) {
						b = block.bullet.exec(cap[i + 1])[0];
						if (bull !== b && !(bull.length > 1 && b.length > 1)) {
							src = cap.slice(i + 1).join('\n') + src;
							i = l - 1;
						}
					}

					// Determine whether item is loose or not.
					// Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
					// for discount behavior.
					loose = next || /\n\n(?!\s*$)/.test(item);
					if (i !== l - 1) {
						next = item.charAt(item.length - 1) === '\n';
						if (!loose)
							loose = next;
					}

					this.tokens.push({
						type: loose
							? 'loose_item_start'
							: 'list_item_start'
					});

					// Recurse.
					this.token(item, false, bq);

					this.tokens.push({type: 'list_item_end'});
				}

				this.tokens.push({type: 'list_end'});

				continue;
			}

			// html
			if (cap = this.rules.html.exec(src)) {
				src = src.substring(cap[0].length);
				this.tokens.push({
					type: this.options.sanitize
						? 'paragraph'
						: 'html',
					pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
					text: cap[0]
				});
				continue;
			}

			// def
			if ((!bq && top) && (cap = this.rules.def.exec(src))) {
				src = src.substring(cap[0].length);
				this.tokens.links[cap[1].toLowerCase()] = {
					href: cap[2],
					title: cap[3]
				};
				continue;
			}

			// table (gfm)
			if (top && (cap = this.rules.table.exec(src))) {
				src = src.substring(cap[0].length);

				item = {
					type: 'table',
					header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
					align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
					cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
				};

				for (i = 0; i < item.align.length; i++) {
					if (/^ *-+: *$/.test(item.align[i])) {
						item.align[i] = 'right';
					} else if (/^ *:-+: *$/.test(item.align[i])) {
						item.align[i] = 'center';
					} else if (/^ *:-+ *$/.test(item.align[i])) {
						item.align[i] = 'left';
					} else {
						item.align[i] = null;
					}
				}

				for (i = 0; i < item.cells.length; i++) {
					item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
				}

				this.tokens.push(item);

				continue;
			}

			// top-level paragraph
			if (top && (cap = this.rules.paragraph.exec(src))) {
				src = src.substring(cap[0].length);
				this.tokens.push({
					type: 'paragraph',
					text: cap[1].charAt(cap[1].length - 1) === '\n'
						? cap[1].slice(0, -1)
						: cap[1]
				});
				continue;
			}

			// text
			if (cap = this.rules.text.exec(src)) {
				// Top-level should never reach here.
				src = src.substring(cap[0].length);
				this.tokens.push({type: 'text', text: cap[0]});
				continue;
			}

			if (src) {
				throw new
				Error('Infinite loop on byte: ' + src.charCodeAt(0));
			}
		}

		return this.tokens;
	}
}
