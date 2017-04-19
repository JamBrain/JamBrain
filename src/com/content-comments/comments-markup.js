import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';
import InputTextArea					from 'com/input-textarea/input-textarea';

export default class ContentCommentsMarkup extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props, nextProps);
	}
	
	render( props ) {
		var Class = [
//			"content-common-body",
			"-markup"
		];
		if ( typeof props.class == 'string' ) {
			Class = Class.concat(props.class.split(' '));
		}
		
		var Text = props.children.join('');

		if (props.editing) {
			var Height = this.textarea ? this.textarea.scrollHeight : 0;
			
			var Limit = props.limit ? props.limit : 2048;
			//var Chars = props.children[0] ? props.children[0].length : 0;
			
			return (
				<div class={Class}>
					<div class="-label">{props.label}</div>
					<InputTextArea 
						value={Text} 
						onModify={props.onmodify} 
						placeholder={props.placeholder} 
						ref={(input) => { this.textarea = input; }} 
						maxlength={Limit}
					/>
				</div>
			);

//
//					<div class="-textarea">
//						<InputTextArea 
//							name="paragraph_text" 
//							value={props.children} 
//							onModify={props.onmodify} 
//							placeholder={props.placeholder} 
//							ref={(input) => { this.textarea = input; }} 
//							maxlength={Limit}
//						/>
//					<div class="-footer">
//						<div class="-right"><span class="-chars">{Chars}</span>/<span class="-limit">{Limit}</span></div>
//						<div class="-left">Supports <NavLink blank href="/markdown"><SVGIcon>markdown</SVGIcon> <strong>Markdown</strong></NavLink> and <NavLink href="//emoji.codes/"><strong>:emoji_codes:</strong></NavLink></div>
//					</div>
		}
		else {
			Class.push("markup");

			// NOTE: only parses the first child
			//var Text = props.children.length ? marked.parse(props.children[0]) : "";
			Text = marked.parse(Text);

			return <div class={Class} dangerouslySetInnerHTML={{__html: Text}} />;
		}
	}
}
