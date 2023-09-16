import { Component } from 'preact';
import './tagbox.module.less';

import {Icon} from './icon';
import {Button} from './button';

export class Tagbox extends Component {
	constructor( props ) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick( index ) {
		let {props} = this;

		if ( props.onClick ) {
			props.onClick(index);
		}
	}

	renderTag( tag, index ) {
		if ( tag && tag.name ) {
			return (
				<Button class="-tag" title={tag.id+' - '+tag.slug} onClick={this.onClick.bind(this, index)}>
					<div class="-text">{tag.name}</div>
					<div class="-tail-icon">
						<Icon class="_if-parent-parent-no-hover-inline" src="circle" small />
						<Icon class="_if-parent-parent-hover-inline" src="cross" small />
					</div>
					<div class="-tail" />
				</Button>
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
				<div class={`ui-tagbox ${props.class ?? ''}`}>
					{this.renderTags(props.tags)}
				</div>
			);
		}
		return null;
	}
}
