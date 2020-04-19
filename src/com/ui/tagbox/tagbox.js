import {h, Component}					from 'preact/preact';
import UIIcon							from 'com/ui/icon/icon';
import UIButton							from 'com/ui/button/button';

export default class UITagbox extends Component {
	constructor( props ) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick( index ) {
		let {props} = this;

		if ( props.onclick ) {
			props.onclick(index);
		}
	}

	renderTag( tag, index ) {
		if ( tag && tag.name ) {
			return (
				<UIButton class="-tag" title={tag.id+' - '+tag.slug} onclick={this.onClick.bind(this, index)}>
					<div class="-text">{tag.name}</div>
					<div class="-tail-icon">
						<UIIcon class="_if-parent-parent-no-hover-inline" src="circle" small />
						<UIIcon class="_if-parent-parent-hover-inline" src="cross" small />
					</div>
					<div class="-tail" />
				</UIButton>
			);
		}
		return null;
	}
	renderTags( tags ) {
		let Out = [];

		for ( let idx = 0; idx < tags.length; idx++ ) {
			Out.push(this.renderTag(tags[idx], idx));
		}

		return Out;
	}


	render( props ) {
		if ( props.tags ) {
			return (
				<div class={cN("ui-tagbox", props.class)}>
					{this.renderTags(props.tags)}
				</div>
			);
		}
		return null;
	}
}
