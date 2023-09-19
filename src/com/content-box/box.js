import { Component } from 'preact';
import './box.less';

import Shallow from 'shallow';

import ContentLoading from 'com/content-loading/loading';
import {Button, Icon, Image} from 'com/ui';

import { node_CountAuthors } from 'internal/lib';

import $Node from 'backend/js/node/node';

export default class ContentBox extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'authors': null,
			'parent': null,
		};
	}

	componentDidMount() {
		this.getParent(this.props);
	}

	componentWillReceiveProps( nextProps ) {
		if ( Shallow.Diff(this.props, nextProps) ) {
			this.getParent(nextProps);
		}
	}

	getParent( props ) {
		var node = props.node;

		if ( node && node.parent ) {
			return $Node.Get(node.parent)
				.then(r => {
					if ( r && r.node && r.node.length ) {
						var Parent = r.node[0];
						this.setState({ 'parent': Parent });
					}
				});
		}
		return Promise.resolve({});
	}

	getAuthors() {

	}

	render( props, state ) {
		props = Object.assign({}, props);
		const { node, path, extra } = props;

		if ( node /* && state.authors */ ) {
			var Class = ["content-box"];

			var Title = node.name;

			var CoverFail = '///content/internal/tvfail.png';
			var Cover = (node.meta && node.meta.cover) ? node.meta.cover : CoverFail;
			var HoverCover = (node.meta && node.meta['hover-cover']) ? node.meta['hover-cover'] : CoverFail;

//			Cover += '.320x256.fit.jpg';
//			Cover += '.640x512.fit.jpg';
			Cover += '.480x384.fit.jpg';

			var ShowHoverCover = null;
			if ( node.meta['cover-hover'] ) {
				ShowHoverCover = <Image class="-cover-hover" src={HoverCover} srcError={CoverFail} />;
			}

			var ShowEvent = null;
			if ( !props.noevent && state.parent && state.parent.name ) {
				ShowEvent = <div>{state.parent.name}</div>;
			}

			let ShowSubEvent = null;
			let SubEventClass = null;
			if ( !props.nosubevent && node.subtype ) {
				if ( !node.published ) {
					ShowSubEvent = <div><Icon class="-baseline -small" src="cross" /></div>;
				}
				else if ( node.subtype == 'game' ) {
					ShowSubEvent = <div>GAME</div>;
					if ( node.subsubtype ) {
						if ( node.subsubtype == 'jam' ) {
							ShowSubEvent = <div>JAM <Icon class="-baseline -small" src={node_CountAuthors(node) === 1 ? "user" : "users"} /></div>;
							SubEventClass = '-col-a';
						}
						else if ( node.subsubtype == 'extra' ) {
							ShowSubEvent = <div>EXTRA <Icon class="-baseline -small" src={node_CountAuthors(node) === 1 ? "user" : "users"} /></div>;
							SubEventClass = '-col-bc';
						}
						else if ( node.subsubtype == 'compo' ) {
							ShowSubEvent = <div>COMPO</div>;
							SubEventClass = '-col-ab';
						}
						else if ( node.subsubtype == 'craft' ) {
							ShowSubEvent = <div>CRAFT</div>;
							SubEventClass = '-col-b';
						}
						else if ( node.subsubtype == 'release' ) {
							ShowSubEvent = <div>RELEASE</div>;
							SubEventClass = '-col-ca';
						}
						else if ( node.subsubtype == 'unfinished' ) {
							ShowSubEvent = <div><Icon class="-baseline -small" src="cross" /></div>;
						}
					}
				}
				else if ( node.subtype == 'tool' ) {
					ShowSubEvent = <div>TOOL</div>;
					SubEventClass = '-col-c';
				}
			}

			let ShowTrophies = null;
			if ( node.magic ) {
				ShowTrophies = [];

				for ( let key in node.magic ) {
					let parts = key.split('-');
					if ( /*ShowTrophies.length < 6 &&*/ parts.length == 3 && parts[0] == 'grade' && parts[2] == 'result' ) {
						if ( node.magic[key] == 1 )
							ShowTrophies.push(<span class="-first"><Icon src="trophy" /></span>);
						else if ( node.magic[key] == 2 )
							ShowTrophies.push(<span class="-second"><Icon src="trophy" /></span>);
						else if ( node.magic[key] == 3 )
							ShowTrophies.push(<span class="-third"><Icon src="trophy" /></span>);
					}
				}
//				ShowTrophies.sort(function(a, b) {
//					sortOrder = ['-first', '-second', '-third'];
//					regexPattern = /class=\"([^\"]+)/;
//					return sortOrder.indexOf(regexPattern.exec(a)[1]) - sortOrder.indexOf(regexPattern.exec(b)[1]);
//				});
			}

			return (
				<Button class={`${Class ?? ''} ${props.class ?? ''}`} href={node.path}>
					{ShowHoverCover}
					<Image class="-cover" src={Cover} srcError={CoverFail} />
					<div class="-top-bar">
						{ShowEvent}
					</div>
					<div class={`-sub-event ${SubEventClass ?? ''}`}>
						{ShowSubEvent}
					</div>
					<div class="-bot-left">
						{ShowTrophies}
					</div>
					<div class="-bot-right">
					</div>
					<div class="-bot-bar">
						<div class="-title">{Title}</div>
					</div>
				</Button>
			);
		}
		else if (props.placeHolder) {
			return <div class={`${Class ?? ''} ${props.class ?? ''} -place-holder`} />;
		}
		else {
			return <ContentLoading />;
		}
	}
}
