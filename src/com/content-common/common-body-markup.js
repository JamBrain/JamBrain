import {h, Component} 				from 'preact/preact';
import {shallowDiff} 					from 'shallow-compare/index';

import NavLink 								from 'com/nav-link/link';
import SVGIcon 								from 'com/svg-icon/icon';
import InputTextArea 					from 'com/input-textarea/input-textarea';
import marked 								from '../../internal/marked/marked';

export default class ContentCommonBodyMarkup extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return shallowDiff(this.props, nextProps);
  }

  render(props) {
    var Class = ["content-common-body", "-markup"];
    if (typeof props.class == 'string') {
      Class = Class.concat(props.class.split(' '));
    }

    var Label = props.label
      ? props.label
      : "Description";
    var Placeholder = props.placeholder
      ? props.placeholder
      : "Description";

    var Text = props.children.join('');

    if (props.editing) {
      //var Height = this.textarea ? this.textarea.scrollHeight : 0;

      var Limit = props.limit
        ? props.limit
        : 8192;
      //var Chars = props.children[0] ? props.children[0].length : 0;

      return (
        <div class={Class}>
          <div class="-label">{Label}</div>
          <InputTextArea
            user={props.user}
            value={Text}
            onmodify={props.onmodify}
						onkeydown={props.onkeydown}
						onkeyup={props.onkeyup}
						onblur={props.onblur}
						onfocus={props.onfocus}
						oncaret={props.oncaret}
            placeholder={Placeholder}
            ref={(input) => {this.textarea = input;}}
            maxlength={Limit}
						replaceText={props.replaceText}
						replaceTextEvent={props.replaceTextEvent}
						cursorPos={props.cursorPos}
          />
        </div>
      );

      //					<div class="-textarea">
      //						<InputTextArea
      //							name="paragraph_text"
      //							value={props.children}
      //							onmodify={props.onmodify}
      //							placeholder={props.placeholder}
      //							ref={(input) => { this.textarea = input; }}
      //							maxlength={Limit}
      //						/>
      //					</div>
      //					<div class="-footer">
      //						<div class="-right"><span class="-chars">{Chars}</span>/<span class="-limit">{Limit}</span></div>
      //						<div class="-left">Supports <NavLink blank href="/markdown"><SVGIcon>markdown</SVGIcon> <strong>Markdown</strong></NavLink> and <strong>:emoji_codes:</strong></div>
      //					</div>
    } else {
      Class.push("markup");

      if (!Text.trim().length) {
        Text = Placeholder;
      }

      var markedOptions = {
        highlight: function(code, lang) {
          var language = Prism.languages.clike;
          if (Prism.languages[lang])
            language = Prism.languages[lang];
          return Prism.highlight(code, language);
        },
        sanitize: true, // disable HTML
        smartypants: true, // enable automatic fancy quotes, ellipses, dashes
        langPrefix: 'language-'
      };

      // NOTE: only parses the first child
      //var Text = props.children.length ? marked.parse(props.children[0]) : "";
			var mrkd = new marked();
      markdown = mrkd.parse(Text, markedOptions);

      return (<div class={Class}>{markdown}</div>);
    }
  }
}
