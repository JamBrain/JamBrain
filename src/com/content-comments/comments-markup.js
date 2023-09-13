import {h, Component, toChildArray} from 'preact';
import cN from 'classnames';
import {Diff}	 				from 'shallow';

import InputTextArea					from 'com/input-textarea/input-textarea';

import marked 							from 'internal/marked/marked';
import $Node							from 'shrub/js/node/node';

const MAX_LENGTH = 4096;

export default class ContentCommentsMarkup extends Component {
	constructor( props ) {
		super(props);
	}

	// MK: Normally this checks children. Is this correct?
	shouldComponentUpdate( nextProps ) {
		return Diff(this.props, nextProps);
	}

	isCommentingOnOwnPost() {
		const {node, user} = this.props;
		return node && user && ((node.author == user.id) || (node.meta && node.meta.authors && node.meta.authors.indexOf(user.id) > -1));
	}

	postIsAnItem() {
		let {node} = this.props;
		return node.type == 'item';
	}

	checkSelfLinking() {
		if (this.postIsAnItem() && !this.isCommentingOnOwnPost() ) {
			const txt = toChildArray(this.props.children).join('');
			const {user} = this.props;
			const authoring = (user && user.private && user.private.refs) ? user.private.refs.author : null;
			if (authoring && authoring.length > 0) {
				return $Node.Get(authoring)
					.then(data=> {
						let foundBad = false;
						data.node.forEach(node => {
							if (!foundBad && txt.indexOf(node.path) != -1) {
								const err = "Asking others to play your game is highly discouraged. To get ratings and feedback, play games and leave feedback. Also, give a like to any good feedback you see. This website rewards good community behavior with improved visibility. If we catch you abusing it, it can punish too.";
								this.setState({'warnSelfLinking': err});
								foundBad = true;
							}
						});
						if (!foundBad) this.setState({'warnSelfLinking': null});
					});
			}
		}
		return Promise.resolve();
	}

	render( props, state ) {
		var Class = [
//			"body",
//			"-markup"
		];

		var Text = toChildArray(props.children).join('');

		if ( props.editing ) {
			//var Height = this.textarea ? this.textarea.scrollHeight : 0;
			let ShowHelpText = [];
			const {warnSelfLinking} = state;

			const Limit = props.limit ? props.limit : MAX_LENGTH;
			//var Chars = props.children[0] ? props.children[0].length : 0;
			if (Limit === Text.length) {
				ShowHelpText.push(<div key="limit">You have reached the maximum comment length. If you want to write more, consider making it two comments.</div>);
			}
			if (warnSelfLinking) {
				ShowHelpText.push(<div key="self-link">{warnSelfLinking}</div>);
			}

			return (
				<div class={cN(Class, props.class)}>
					<div class="-label">{props.label}</div>
					<InputTextArea
						user={props.user}
						value={Text}
						onModify={props.onModify}
						onKeyDown={props.onKeyDown}
						onKeyUp={props.onKeyUp}
						onBlur={props.onBlur}
						onFocus={props.onFocus}
						oncaret={props.oncaret}
						placeholder={props.placeholder}
						replaceText={props.replaceText}
						replaceTextEvent={props.replaceTextEvent}
						cursorPos={props.cursorPos}
						ref={(input) => { this.textarea = input; }}
						maxLength={Limit}
					/>
					{(ShowHelpText.length > 0) && <div class='-helparea'>{ShowHelpText}</div>}
				</div>
			);
		}
		else {
			Class.push("-markup");
			Class.push("markup");

			// NOTE: only parses the first child
			//var Text = props.children.length ? marked.parse(props.children[0]) : "";
			var mrkd = new marked();

			var markedOptions = {
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

			markdown = mrkd.parse(Text, markedOptions);

			return <div class={cN(Class, props.class)}>{markdown}</div>;
		}
	}

	componentDidUpdate() {
		this.checkSelfLinking();
	}
}
