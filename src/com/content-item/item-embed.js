import { Component } from 'preact';
import './item-embed.less';

import {Button, Icon, Image} from 'com/ui';
import {node_HasEmbed, node_GetEmbed} from 'internal/lib';

export default class ContentItemEmbed extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'play': false
		};

		this.onPlay = this.onPlay.bind(this);
	}

	onPlay() {
		this.setState({'play': true});
	}

	render(props, state) {
		let {node} = props;

		let embed = null;
		if ( node_HasEmbed(node) ) {
			let file = node_GetEmbed(node);

			let path = node.meta['embed-path'] ? node.meta['embed-path'] : 'index.html';
			embed = '//files.jam.host/embed/$'+node.id+'/'+file.id+'/'+path;
		}

		if ( embed ) {
			const max_embed_width = 948;
			const default_embed_width = 948;
			const max_embed_height = 948;
			const default_embed_height = 533;

			// TODO: add support for aspect ratio

			let width = node.meta['embed-width'] ? Number(node.meta['embed-width']) : default_embed_width;
			let height = node.meta['embed-height'] ? Number(node.meta['embed-height']) : default_embed_height;

			width = (width > max_embed_width) ? max_embed_width : width;
			height = (height > max_embed_height) ? max_embed_height : height;

			//let cover = node.meta['embed-cover'] ? node.meta['embed-cover'] : null;
			let cover = node.meta.cover ? node.meta.cover+'.'+width+'x'+height+'.fit.jpg' : null;

			if ( state.play ) {
				// allow-same-origin -- allow cookie access (MK: Might not need this)
				// allow-scripts -- allow JavaScript
				// allow-pointer-lock -- allow mouse to capture pointer
				//
				// allow="fullscreen" -- modern way to allow it
				// allow="xr-spatial-tracking" -- AR/VR support
				// allow="cross-origin-isolated"
				return (
					<div class="embed">
						<iframe sandbox="allow-scripts allow-pointer-lock" allowFullScreen src={embed} style={"width: "+width+"px; height: "+height+"px;"} />
					</div>
				);
			}
			else {
				let placeHolder = cover ? <Image src={cover} style={"width: "+width+"px; height: "+height+"px;"} /> : <div style={"width: "+width+"px; height: "+height+"px;"} />;

				return (
					<Button class="embed -preview" onclick={this.onPlay}>
						{placeHolder}
						<Icon>play</Icon>
					</Button>
				);
			}
		}

		return <div class="embed" />;
	}
}
