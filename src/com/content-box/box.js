import { h, Component } 				from 'preact/preact';
import Shallow							from 'shallow/shallow';

import ContentLoading					from 'com/content-loading/loading';
import IMG2								from 'com/img2/img2';

import ButtonLink						from 'com/button-link/link';

import $Node							from '../../shrub/js/node/node';

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
						this.setState({'parent': Parent});
					}
				});
		}
		return Promise.resolve({});
	}

	getAuthors() {
		
	}

	render( props, state ) {
		props = Object.assign({}, props);

		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;

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
				ShowHoverCover = <IMG2 class="-cover-hover" src={HoverCover} failsrc={CoverFail} />;
			}
			
			var ShowEvent = null;
			if ( !props.noevent && state.parent && state.parent.name ) {
				ShowEvent = <div>{state.parent.name}</div>;
			}
			
			var ShowSubEvent = null;
			var SubEventClass = null;
			if ( !props.nosubevent && node.subtype ) {
				if ( node.subtype == 'game' ) {
					if ( node.subsubtype ) {
						if ( node.subsubtype == 'jam' ) {
							ShowSubEvent = <div>JAM</div>;
							SubEventClass = '-col-a';
						}
						else if ( node.subsubtype == 'compo' ) {
							ShowSubEvent = <div>COMPO</div>;
							SubEventClass = '-col-ab';
						}
					}
				}
				else if ( node.subtype == 'tool' ) {
					ShowSubEvent = <div>TOOL</div>;
					SubEventClass = '-col-c';
				}
			}

			return (
				<ButtonLink class={cN(Class, props.class)} href={node.path}>
					{ShowHoverCover}
					<IMG2 class="-cover" src={Cover} failsrc={CoverFail} />
					<div class="-top">
						{ShowEvent}
					</div>
					<div class={cN("-sub-event", SubEventClass)}>
						{ShowSubEvent}
					</div>
					<div class="-bot">
						<div class="-title">{Title}</div>
					</div>
				</ButtonLink>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
