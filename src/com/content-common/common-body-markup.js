import {Component, toChildArray} from 'preact';
import cN from 'classnames';
import './common-body-markup.less';

import {Diff} 					from 'shallow';

import InputTextArea 					from 'com/input-textarea/input-textarea';
import marked 								from 'internal/marked/marked';

export default class ContentCommonBodyMarkup extends Component {
  constructor(props) {
    super(props);
  }

  // MK: This normal checks children. Is this correct?
  shouldComponentUpdate(nextProps) {
    return Diff(this.props, nextProps);
  }

  render(props) {
    var Class = ["body", "-markup"];
    if (typeof props.class == 'string') {
      Class = Class.concat(props.class.split(' '));
    }

    var Label = props.label
      ? props.label
      : "Description";
    var Placeholder = props.placeholder
      ? props.placeholder
      : "Description";

    var Text = toChildArray(props.children).join('');

    if (props.editing) {
      //var Height = this.textarea ? this.textarea.scrollHeight : 0;

      var Limit = props.limit
        ? props.limit
        : 8192;
      //var Chars = props.children[0] ? props.children[0].length : 0;

      return (
        <div class={cN(Class)}>
          <div class="-label">{Label}</div>
          <InputTextArea
            user={props.user}
            value={Text}
            onModify={props.onModify}
						onKeyDown={props.onKeyDown}
						onKeyUp={props.onKeyUp}
						onBlur={props.onBlur}
						onFocus={props.onFocus}
						oncaret={props.oncaret}
            placeholder={Placeholder}
            ref={(input) => (this.textarea = input)}
            maxLength={Limit}
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
      //							onModify={props.onModify}
      //							placeholder={props.placeholder}
      //							ref={(input) => { this.textarea = input; }}
      //							maxLength={Limit}
      //						/>
      //					</div>
      //					<div class="-footer">
      //						<div class="-right"><span class="-chars">{Chars}</span>/<span class="-limit">{Limit}</span></div>
      //						<div class="-left">Supports <NavLink blank href="/markdown"><UIIcon>markdown</UIIcon> <strong>Markdown</strong></NavLink> and <strong>:emoji_codes:</strong></div>
      //					</div>
    }
    else {
      Class.push("markup");

      if (!Text.trim().length) {
        Text = Placeholder;
      }

      let markedOptions = {
        'highlight': function(code, lang) {
          var language = Prism.languages.clike;
          if (Prism.languages[lang])
            language = Prism.languages[lang];
          return Prism.highlight(code, language);
        },
        'sanitize': true, // disable HTML
        'smartypants': true, // enable automatic fancy quotes, ellipses, dashes
        'showLinks': !props.untrusted,
        'langPrefix': 'language-'
      };

      // NOTE: only parses the first child
      //var Text = props.children.length ? marked.parse(props.children[0]) : "";
			let mrkd = new marked();
      let markdown = mrkd.parse(Text, markedOptions);

      return (<div class={cN(Class)}>{markdown}</div>);
    }
  }
}
