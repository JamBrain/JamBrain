import { h, Component } 				from 'preact/preact';

import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import IMG2 							from 'com/img2/img2';

import ButtonBase						from 'com/button-base/base';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyField			from 'com/content-common/common-body-field';
import ContentCommonBodyLink			from 'com/content-common/common-body-link';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonNav					from 'com/content-common/common-nav';
import ContentCommonNavButton			from 'com/content-common/common-nav-button';

import VoteMetrics						from 'com/content-item/vote-metrics';
import VoteOptOut						from 'com/content-item/vote-optout';
import VoteOrResults					from 'com/content-item/vote-modal';

import ContentSimple					from 'com/content-simple/simple';

import $Node							from '../../shrub/js/node/node';
import $NodeMeta						from '../../shrub/js/node/node_meta';
import $Asset							from '../../shrub/js/asset/asset';

export default class ContentItem extends Component {
	constructor( props ) {
		super(props);

		let node = props.node;

		this.state = {
			'parent': null,

			'linkUrls': [],
			'linkTags': [],
			'linkNames': [],

			'linksShown': 1,

//			'platforms': [],
//			'tags': [],
		};

		for ( let i = 0; i < 9; i++ ) {
			this.state.linkUrls[i] = node.meta['link-0'+(i+1)] ? node.meta['link-0'+(i+1)] : '';
			this.state.linkTags[i] = node.meta['link-0'+(i+1)+'-tag'] ? parseInt(node.meta['link-0'+(i+1)+'-tag']) : 0;
			this.state.linkNames[i] = node.meta['link-0'+(i+1)+'-name'] ? node.meta['link-0'+(i+1)+'-name'] : '';

			if ( this.state.linkUrls[i] && i+1 > this.state.linksShown ) {
				this.state.linksShown = i+1;
			}
		}

		this.onSetJam = this.onSetJam.bind(this);
		this.onSetCompo = this.onSetCompo.bind(this);
		this.onSetUnfinished = this.onSetUnfinished.bind(this);
	}

	componentDidMount() {
		var node = this.props.node;

		$Node.Get(node.parent)
		.then(r => {
			if ( r.node && r.node.length ) {
				var Parent = r.node[0];
				this.setState({'parent': Parent});
			}
			return Promise.resolve({});
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

	setSubSubType( type ) {
		return $Node.Transform(this.props.node.id, 'item', 'game', type)
		.then( r => {
			if ( r ) {
				if ( r && r.changed ) {
					this.props.node.subsubtype = type;
					this.setState({});
				}
			}
			return r;
		});
	}

	onSetJam( e ) {
		return this.setSubSubType('jam')
			.then( r => {
			});
	}
	onSetCompo( e ) {
		return this.setSubSubType('compo')
			.then( r => {
			});
	}
	onSetUnfinished( e ) {
		return this.setSubSubType('unfinished')
			.then( r => {
			});
	}

  onUpload( name, e ) {
		var node = this.props.node;
		var user = this.props.user;

		if ( !this.props.user )
			return null;

		var FileName = null;

		if ( e.target.files && e.target.files.length ) {
			var file = e.target.files[0];

			return $Asset.Upload(user.id, file)
				.then(r => {
					if ( r && r.path ) {
						FileName = '///content/'+r.path;

						let Data = {};
						Data[name] = FileName;

						return $NodeMeta.Add(node.id, Data);
					}

					return Promise.resolve({});
				})
				.then(r => {
					if ( r && r.changed ) {
						this.props.node.meta[name] = FileName;
						this.setState({});
					}
				})
				.catch(err => {
					this.setState({ 'error': err });
				});
		}
	}

	onModifyLinkName( Index, e ) {
		var Names = this.state.linkNames;
		Names[Index] = e.target.value;
		this.setState({'modified': true, 'linkNames': Names});
		// Update save button
		this.contentSimple.setState({'modified': true});
	}

	onModifyLinkTag( Index, e ) {
		var Tags = this.state.linkTags;
		Tags[Index] = e;//e.target.value;
		this.setState({'modified': true, 'linkTags': Tags});
		// Update save button
		this.contentSimple.setState({'modified': true});
	}

	onModifyLinkUrl( Index, e ) {
		var URLs = this.state.linkUrls;
		URLs[Index] = e.target.value;
		this.setState({'modified': true, 'linkUrls': URLs});
		// Update save button
		this.contentSimple.setState({'modified': true});
	}

	onSave( e ) {
		var node = this.props.node;
		var user = this.props.user;

		if ( !user )
			return null;

		let Data = {};
		let Changes = 0;
		for ( let i = 0; i < this.state.linkUrls.length; i++ ) {
			let Base = 'link-0'+(i+1);

			// Figure out what data has changed
			{
				let Old = node.meta[Base] ? node.meta[Base] : '';
				let New = this.state.linkUrls[i].trim();

				if ( Old != New ) {
					Data[Base] = this.state.linkUrls[i];
					this.props.node.meta[Base] = Data[Base];
					Changes++;
				}
			}

			{
				let Old = node.meta[Base+'-tag'] ? parseInt(node.meta[Base+'-tag']) : 0;
				let New = parseInt(this.state.linkTags[i]);

				if ( Old != New ) {
					Data[Base+'-tag'] = this.state.linkTags[i];
					this.props.node.meta[Base+'-tag'] = Data[Base+'-tag'];
					Changes++;
				}
			}

			{
				let Old = node.meta[Base+'-name'] ? node.meta[Base+'-name'] : '';
				let New = this.state.linkNames[i].trim();

				if ( Old != New ) {
					Data[Base+'-name'] = this.state.linkNames[i];
					this.props.node.meta[Base+'-name'] = Data[Base+'-name'];
					Changes++;
				}
			}
		}

//		this.setState({});		
//		console.log(Data);

		return $NodeMeta.Add(node.id, Data);
	}

	// Generates JSX for the links, depending on whether the page is editing or viewing
	makeLinks( editing ) {
		let LinkMeta = [];

		for ( let idx = 0; idx < this.state.linksShown; idx++ ) {
			LinkMeta.push(
				<ContentCommonBodyLink
					name={this.state.linkNames[idx]}
					tag={this.state.linkTags[idx]}
					url={this.state.linkUrls[idx]}
					urlPlaceholder="http://example.com/file.zip"
					editing={editing}
					filter='platform'
					onModifyName={this.onModifyLinkName.bind(this, idx)}
					onModifyTag={this.onModifyLinkTag.bind(this, idx)}
					onModifyUrl={this.onModifyLinkUrl.bind(this, idx)}
				/>
			);
		}

		if ( editing && this.state.linksShown < 9 ) {
			LinkMeta.push(
				<button onclick={e => this.setState({'linksShown': ++this.state.linksShown})}>+</button>
			);
		}

//					namePlaceholder="Web"
//					urlPlaceholder="http://example.com/web.html"
//					namePlaceholder="Windows"
//					urlPlaceholder="http://example.com/windows.exe"
//					namePlaceholder="Mac"
//					urlPlaceholder="http://example.com/mac.app"
//					namePlaceholder="Linux"
//					urlPlaceholder="http://example.com/linux.tar.gz"
//					namePlaceholder="Source"
//					urlPlaceholder="http://example.com/source.zip"

		return (
			<ContentCommonBody class="-links">
				<div class="-label">Links</div>
				{LinkMeta}
			</ContentCommonBody>
		);
	}

	updatePropsAndGetCategory(props, node) {
		let Category = '/';

		if ( node ) {
			if ( node.subtype == 'game' ) {
				props.header = "GAME";
				props.headerClass = "-col-a";
				props.titleIcon = "gamepad";
			}
			else if ( node.subtype == 'tool' ) {
				props.header = "TOOL";
				props.headerClass = "-col-c";
				props.titleIcon = "hammer";
			}

			if ( node.subsubtype == 'jam' ) {
				props.header += ": JAM";
				Category = '/jam';
			}
			else if ( node.subsubtype == 'compo' ) {
				props.header += ": COMPO";
				Category = '/compo';
			}
			else if ( node.subsubtype == 'craft' ) {
				props.header += ": CRAFT";
				Category = '/craft';
			}
			else if ( node.subsubtype == 'release' ) {
				props.header += ": RELEASE";
				Category = '/release';
			}
			else if ( node.subsubtype == 'unfinished' ) {
				props.headerClass = null;
				props.header += ": UNFINISHED";
				Category = '/unfinished';
			}
			else {
				props.nopublish = true;
			}

			props.draft = "Game";
		}
		return Category;
	}
	
	render( props, state ) {
		props = Object.assign({}, props);
		
		const node = props.node;
		const user = props.user;
		const path = props.path;
		const extra = props.extra;
		const featured = props.featured;
		const parent = state.parent;
		const editing = extra && extra.length && extra[0] == 'edit' && node_CanPublish(parent);
		// This seems wrong, it would make more sense to update state.
		const Category = this.updatePropsAndGetCategory(props, node);
		
		let ShowEventPicker = null;
		if ( editing ) {
			ShowEventPicker = (
				<ContentCommonNav>
					<div class="-label">Event</div>
					<ContentCommonNavButton onclick={this.onSetJam} class={Category == '/jam' ? "-selected" : ""}><SVGIcon>users</SVGIcon><div>Jam</div></ContentCommonNavButton>
					<ContentCommonNavButton onclick={this.onSetCompo} class={Category == '/compo' ? "-selected" : ""}><SVGIcon>user</SVGIcon><div>Compo</div></ContentCommonNavButton>
					<ContentCommonNavButton onclick={this.onSetUnfinished} class={Category == '/unfinished' ? "-selected" : ""}><SVGIcon>trash</SVGIcon><div>Unfinished</div></ContentCommonNavButton>
					<div class="-footer">
						<strong>NOTE</strong>: You <strong>MUST</strong> click this before you will be able to Publish.<br />
						Please refer to <NavLink blank href="/events/ludum-dare/rules"><strong>the rules</strong></NavLink>. If you {"don't"} know what to pick, pick the <strong>Jam</strong>.
					</div>
				</ContentCommonNav>
			);
		}
		
		// Votes, grades and metrics
		let ShowMetrics = (<VoteMetrics node={node} />);		
		let ShowGrade = (<VoteOrResults node={node} nodeComponent={parent} user={user} featured={featured} />);				
		let ShowOptOut = null;
		if (VoteOptOut.canOptOut(parent)) {
			ShowOptOut = (<VoteOptOut nodeComponent={parent} node={node} optOutCallback={ () => this.setState({}) } />);
		}
		
		let ShowImages = null;

		if ( true ) {
			let ShowImage = null;
			if ( node.meta && node.meta.cover ) {
				ShowImage = <IMG2 class="-img" src={node.meta && node.meta.cover ? node.meta.cover+'.320x256.fit.jpg' : "" } />;
			}

			ShowImages = (
				<ContentCommonBody class="-images">
					<div class="-label">Images</div>
					<div>Cover Image</div>
					<div class="-upload">
						<div class="-path">{node.meta && node.meta.cover ? node.meta.cover : "" }</div>
						<label>
							<input type="file" name="asset" style="display: none;" onchange={this.onUpload.bind(this,'cover')} />
							<ButtonBase class="-button"><SVGIcon small baseline gap>upload</SVGIcon>Upload</ButtonBase>
						</label>
						{ShowImage}
					</div>
					<div class="-footer">Recommended Size: 640x512 (i.e. 5:4 aspect ratio). Other sizes will be scaled and cropped to fit. Animated GIFs will not work here.</div>
				</ContentCommonBody>
			);
		}

		let ShowUploadTips = null;

		if ( true ) {
			ShowUploadTips = (
				<ContentCommonBody>
					<br />
					If you're new to Ludum Dare, you should know we don't host your downloads, just links to them. For recommendations where and how to host your files, check out the Hosting Guide:<br />
					<br />
					<NavLink blank href="/events/ludum-dare/hosting-guide">/ludum-dare/hosting-guide</NavLink><br />
					<br />
				</ContentCommonBody>
			);
		}
		// Where you can enter your game links
		let ShowLinkEntry = null;
		let ShowLinkView = null;
		if ( editing ) {
			ShowLinkEntry = this.makeLinks(true /* editing */);
		} else {
			ShowLinkView = this.makeLinks(false /* editing */);
		}

		let ShowUnfinished = null;
		if ( true ) {
			ShowUnfinished = (
				<ContentCommonBody>
					<div class="-label">Images</div>
					<div>Screen Shots - These go up top, in your game's description. Try to keep your GIFs less than 640 pixels wide.</div>
					<div>Video - You can add a YouTube video to your description too.</div>
					<br />
				</ContentCommonBody>
			);
		}


		props.editonly = (
			<div>
				{ShowEventPicker}
				{ShowOptOut}
				{ShowImages}
				{ShowLinkEntry}
				{ShowUploadTips}
				{ShowUnfinished}
			</div>
		);
		props.onSave = this.onSave.bind(this);

		props.viewonly = (
			<div>
				{ShowLinkView}
				{ShowGrade}
				{ShowMetrics}
			</div>
		);

		props.class = cN("content-item", props.class);

		// Shim to update the save button from this method. See https://facebook.github.io/react/docs/refs-and-the-dom.html
		props.ref = c => { this.contentSimple = c; };

		return <ContentSimple {...props} by authors />;
	}
}
