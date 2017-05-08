import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import IMG2 							from 'com/img2/img2';

import ButtonBase						from 'com/button-base/base';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonNav					from 'com/content-common/common-nav';
import ContentCommonNavButton			from 'com/content-common/common-nav-button';

import ContentSimple					from 'com/content-simple/simple';


import $Node							from '../../shrub/js/node/node';
import $NodeMeta						from '../../shrub/js/node/node_meta';
import $Grade							from '../../shrub/js/grade/grade';
import $Asset							from '../../shrub/js/asset/asset';

export default class ContentItem extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'parent': null,
			'grade': null
		};

		this.onSetJam = this.onSetJam.bind(this);
		this.onSetCompo = this.onSetCompo.bind(this);
	}
	
	componentDidMount() {
		var node = this.props.node;
		
		$Node.Get(node.parent)
		.then(r => {
			if ( r.node && r.node.length ) {
				var Parent = r.node[0];
				this.setState({'parent': Parent});
				
				return $Grade.GetMy(node.id);
			}
			return Promise.resolve({});
		})
		.then(r => {
			if ( r.grade ) {
				this.setState({'grade': r.grade});
			}
			else {
				this.setState({'grade': []});
			}
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}
	
//	onClickEdit(e) {
//		console.log('edit');
//		this.setState({ 'edit': true });
//	}
//	onClickPreview(e) {
//		console.log('prev');
//		this.setState({ 'edit': false });
//	}
//	onClickSave(e) {
//		console.log('save');
//		
//		var Title = this.state.title ? this.state.title : this.props.node.name;
//		var Body = this.state.body ? this.state.body : this.props.node.body;
//		
//		return $Node.Update(this.props.node.id, Title, Body)
//		.then(r => {
//			if ( r.status == 200 ) {
//				this.setState({ 'modified': false });
//			}
//			else {
//				if ( r.caller_id == 0 || (r.data && r.data.caller_id == 0) ) {
//					location.hash = "#savebug";
//				}
//				else {
//					this.setState({ 'error': r.status + ": " + r.error });
//				}
//			}
//		})
//		.catch(err => {
//			console.log(err);
//			this.setState({ 'error': err });
//		});
//	}
//	onClickPublish(e) {
//		console.log('pub');
//		
//		this.onClickSave(e)
//		.then( rr => {
//			console.log("LETS PUBLISH");
//			$Node.Publish(this.props.node.id, "compo")
//			.then(r => {
//				if ( r.status == 200 ) {
//					location.hash = "#submit";
//				}
//			})
//			.catch(err => {
//				this.setState({ 'error': err });
//			});
//		})
//		.catch(err => {
//			this.setState({ 'error': err });
//		});
//	}
//
//	onClickPublish2(e) {
//		console.log('pub');
//		
//		this.onClickSave(e)
//		.then( rr => {
//			console.log("LETS PUBLISH");
//			$Node.Publish(this.props.node.id, "jam")
//			.then(r => {
//				if ( r.status == 200 ) {
//					location.hash = "#submit";
//				}
//			})
//			.catch(err => {
//				this.setState({ 'error': err });
//			});
//		})
//		.catch(err => {
//			this.setState({ 'error': err });
//		});
//	}	
//	
//	onModifyTitle( e ) {
//		this.setState({ 'modified': true, 'title': e.target.value });
//	}
//	onModifyBody( e ) {
//		this.setState({ 'modified': true, 'body': e.target.value });
//	}
//	
//	
//	
//	render( {node, user, path, extra}, {edit, modified, authors, title, body, error} ) {
//		var EditMode = false;
//		
//		var ShowError = null;
//
//		var ShowEditBar = null;
//		var ShowItem = null;
//		
//		if ( error ) {
//			ShowError = <div class="-error"><strong>Error</strong>: {error}</div>;
//		}
//
//		// Hack Edit mode only if you're the author
//		if ( user && user.id == node.author ) {
//			var EditMode = extra.length ? extra[0] === 'edit' : false;
//			
//			var IsPublished = node.subsubtype.length;//;Number.parseInt(node.published) !== 0;
//	
//			if ( EditMode ) {
//				ShowEditBar = <ContentHeadlineEdit edit={edit} modified={modified} published={IsPublished} onedit={this.onClickEdit} onpreview={this.onClickPreview} onsave={this.onClickSave} onpublish={this.onClickPublish} onpublish2={this.onClickPublish2} />;
//			}
//		}
//
//		if ( EditMode && edit ) {
//			ShowItem = (
//				<div class="content-base content-common content-item">
//					<ContentHeaderEdit title={title ? title : node.name} event={node.subsubtype} onmodify={this.onModifyTitle} author={authors} />
//					<ContentBody>{IsPublished ? "Event: "+node.subsubtype : ""}</ContentBody>
//					<ContentBodyEdit onmodify={this.onModifyBody}>{body ? body : node.body}</ContentBodyEdit>
//					<ContentFooterEdit node={node} user={user} love />
//				</div>
//			);
//		}
//		else {
//			ShowItem = (
//				<div class="content-base content-common content-item">
//					<ContentHeaderCommon title={title ? title : node.name} path={path} />
//					<ContentBody>{IsPublished ? (<div><strong>Event:</strong> {node.subsubtype}</div>) : ""}</ContentBody>
//					<ContentBodyMarkup>{body ? body : node.body}</ContentBodyMarkup>
//					<ContentFooterCommon node={node} user={user} love />
//				</div>
//			);
//		}
//		
//		if ( EditMode ) {
//			return <div>{ShowEditBar}{ShowError}{ShowItem}</div>;
//		}
//		else {
//			return <div>{ShowItem}</div>;
//		}
//	}

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
	
	onGrade( name, value ) {
		var Node = this.props.node;
		
		return $Grade.Add(Node.id, name, value)
			.then(r => {
				if ( r && r.id || !!r.changed ) {
					var Grades = this.state.grade;
					
					Grades[name] = value;
					
					this.setState({'grade': Grades});
				}
				return r;
			});
	}

	onOptOut( name, value ) {
		var Node = this.props.node;
		
		let Name = name+'-out';
		let Data = {};
		
		if ( value ) {
			Data[Name] = 1;
			
			return $NodeMeta.Add(Node.id, Data)
				.then(r => {
					if ( r && r.changed ) {
						this.props.node.meta[Name] = Data[Name];
						this.setState({});
					}
					return r;
				});
		}
		else {
			Data[Name] = 0;

			return $NodeMeta.Remove(Node.id, Data)
				.then(r => {
					if ( r && r.changed ) {
						this.props.node.meta[Name] = Data[Name];
						this.setState({});
					}
					return r;
				});			
		}
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

	render( props, state ) {
		props = Object.assign({}, props);
		
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		var featured = props.featured;
		var parent = state.parent;
		
		var Category = '/';

		if ( node ) {
			if ( node.subtype == 'game' ) {
				props.header = "GAME";
				props.headerClass = "-col-a";
				props.titleIcon = "gamepad";
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
			else {
				props.nopublish = true;
			}
			
			props.draft = "Game";
		}
		
		var ShowEventPicker = null;
		// TODO: Re-enable this to allow event selection
//		if ( extra && extra.length && extra[0] == 'edit' ) {
//			ShowEventPicker = (
//				<ContentCommonNav>
//					<div class="-label">Event</div>
//					<ContentCommonNavButton onclick={this.onSetJam} class={Category == '/jam' ? "-selected" : ""}><SVGIcon>users</SVGIcon><div>Jam</div></ContentCommonNavButton>
//					<ContentCommonNavButton onclick={this.onSetCompo} class={Category == '/compo' ? "-selected" : ""}><SVGIcon>user</SVGIcon><div>Compo</div></ContentCommonNavButton>
//					<div>Please refer to <NavLink blank href="/events/ludum-dare/rules"><strong>the rules</strong></NavLink>. If you {"don't"} know, pick the <strong>Jam</strong>.<br />Because {"we're"} running late, {"we're"} letting you choose all weekend. Honour system, ok?</div>
//				</ContentCommonNav>
//			);
//		}
		
		var ShowGrade = null;
		if ( parent && node_CanGrade(parent) ) {
			if ( node_IsAuthor(node, user) ) {
				ShowGrade = (
					<ContentCommonBody class="-rating">
						<div class="-header">Ratings</div>
						<div class="-subtext">Your results so far</div>;
						<div class="-items">
						</div>
					</ContentCommonBody>
				);

				//ShowGrade = <ContentCommonBody>You are an Author</ContentCommonBody>;
			}
			else if ( featured && featured.what_node && nodeKeys_HasPublishedParent(featured.what_node, node.parent) ) {
				let Lines = [];
				
				for ( var key in parent.meta ) {
					// Is it a valid grade ?
					let parts = key.split('-');
					if ( parts.length == 2 && parts[0] == 'grade' ) {
						// Make sure they user hasn't opted out
						
						if ( node.meta && !(node.meta[key+'-out']|0) ) {
							Lines.push({'key': key, 'value': parent.meta[key]});
						}
					}
				}
				
				let VoteLines = [];
				for ( let idx = 0; idx < Lines.length; idx++ ) {
					let Line = Lines[idx];
					
					let Title = Line.value;
					let Score = '?';
					if ( state.grade ) {
						Score = state.grade[Line.key] ? state.grade[Line.key] : 0;
					}
					
					let Stars = [];
					for ( let idx2 = 0; idx2 < Score; idx2++ ) {
						Stars.push(<ButtonBase class='-star' onclick={this.onGrade.bind(this, Line.key, idx2+1)}><SVGIcon small baseline>star-full</SVGIcon></ButtonBase>);
					}
					for ( let idx2 = Score; idx2 < 5; idx2++ ) {
						Stars.push(<ButtonBase class='-star' onclick={this.onGrade.bind(this, Line.key, idx2+1)}><SVGIcon small baseline>star-empty</SVGIcon></ButtonBase>);
					}
					Stars.push(<ButtonBase class='-delete' onclick={this.onGrade.bind(this, Line.key, 0)}><SVGIcon small>cross</SVGIcon></ButtonBase>);
					
					VoteLines.push(<div class="-grade"><span class="-title">{Title}:</span> {Stars}</div>);
				}
				
				let ShowRatingSubText = null;
				if ( node.subsubtype == 'jam' )
					ShowRatingSubText = <div class="-subtext">Jam game</div>;
				else if ( node.subsubtype == 'compo' )
					ShowRatingSubText = <div class="-subtext">Compo game</div>;
				
				ShowGrade = (
					<ContentCommonBody class="-rating">
						<div class="-header">Ratings</div>
						{ShowRatingSubText}
						<div class="-items">{VoteLines}</div>
						<div class="-footer">Ratings are saved automatically when you click. When they change, they're saved.</div>
					</ContentCommonBody>
				);
				
				//'
			}
			else if ( !user || !user.id ) {
				ShowGrade = (
					<ContentCommonBody class="-rating">
						<div class="-header">Ratings</div>
						<div class="-items">Please login to rate this game</div>
					</ContentCommonBody>
				);
			}
			else {
				ShowGrade = (
					<ContentCommonBody class="-rating">
						<div class="-header">Ratings</div>
						<div class="-items">Sorry! At this time, only participants are able to rate games.</div>
					</ContentCommonBody>
				);
			}
		}
		else {
			// grading is closed
		}
		
		var ShowPrePub = (
			<div style="background: #E53; color: #FFF; padding: 0 0.5em;"><ContentCommonBody>
				<strong>Hey folks!</strong> We're still finishing the data fields below. Please come back and update your page. We'll have new things fixed and added reguraly.<br />
				<br />
				I've included summaries of what to expect for each. In the mean time, I recommend you add your links above, and a screenshot or two. Here's an example:<br />
				<br />
				<div style="background:#FFF; color:#000; padding: 0.5em; border-radius: 0.25em"><strong>Sample Game:</strong> <NavLink blank href="/events/ludum-dare/38/ludum-dare-dot-com">Ludumdare.com</NavLink></div>
				<br />
				We'll have this cleaned up soon!
			</ContentCommonBody></div>
		);
		
		//'
		
		var ShowOptOut = null;
		if ( parent ) {
			let Lines = [];
			
			for ( var key in parent.meta ) {
				// Is it a valid grade ?
				let parts = key.split('-');
				if ( parts.length == 3 && parts[0] == 'grade' && parts[2] == 'optional' ) {
					// Assuming the category isn't optional
					if ( parent.meta[key]|0 ) {
						let BaseKey = parts[0]+'-'+parts[1];
						
						Lines.push({
							'key': BaseKey, 
							'name': parent.meta[BaseKey],
							'value': (node.meta ? !(node.meta[BaseKey+'-out']|0) : false)
						});
					}
				}
			}

			let OptLines = [];

			for ( let idx = 0; idx < Lines.length; idx++ ) {
				let Line = Lines[idx];
				
//				console.log( Line );
				
				let Icon = null;
				if ( Line.value )
					Icon = <SVGIcon small baseline>checkbox-unchecked</SVGIcon>;
				else
					Icon = <SVGIcon small baseline>checkbox-checked</SVGIcon>;
				
				OptLines.push(<ButtonBase onclick={this.onOptOut.bind(this, Line.key, Line.value)}>{Icon} Do not rate me in <strong>{Line.name}</strong></ButtonBase>);
			}
			
			ShowOptOut = (
				<ContentCommonBody class="-opt-out">
					<div class="-label">Voting Category Opt-outs</div>
					{OptLines}
					<div class="-footer">
						Opt-out of categories here if your team didn't make all your graphics, audio, or music during the event.
						Many participants are making original graphics, audio and music from scratch during the event. As a courtesy, we ask you to opt-out if you didn't do the same.
						Also, some games are not meant to be Humourous or Moody, so you can choose to opt-out of these too.
					</div>
				</ContentCommonBody>
			);
		}
		
		var ShowImages = null;
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
		
		//'

		var ShowLinks = null;
		if ( true ) {
			ShowLinks = (
				<ContentCommonBody class="-links">
					<div class="-label">Links</div>
					<div>Download Links</div>
					<div>Source Code</div>
					<br />
					If you're new to Ludum Dare, you should know we don't host your downloads, just links to them. For recommendations where and how to host your files, check out the Hosting Guide:<br />
					<br />
					<NavLink blank href="/events/ludum-dare/hosting-guide">/ludum-dare/hosting-guide</NavLink><br />
					<br />
				</ContentCommonBody>
			);
		}

		var ShowUnfinished = null;
		if ( true ) {
			ShowUnfinished = (
				<ContentCommonBody>
					<div class="-label">Images</div>
					<div>Screen Shots - These go up top, above your Title and Description. Try to keep your GIFs less than 640 pixels wide.</div>
					<div>Video - Or we can put a YouTube video up top</div>
					<div><del>Hover Video - A GIF or silent MP4 video to play while hovering over Cover art.</del></div>
					<div><del>Embed - This is coming later</del></div>
					<br />
					<div class="-label">Links</div>
					<div>Download Links</div>
					<div>Source Code</div>
					<br />
					If you're new to Ludum Dare, you should know we don't host your downloads, just links to them. For recommendations where and how to host your files, check out the Hosting Guide:<br />
					<br />
					<NavLink blank href="/events/ludum-dare/hosting-guide">/ludum-dare/hosting-guide</NavLink><br />
					<br />
				</ContentCommonBody>
			);
		}

		
		props.editonly = (
			<div>
				{ShowEventPicker}
				{ShowOptOut}
				{ShowImages}
				{ShowPrePub}
				{ShowUnfinished}
			</div>
		);
//				{ShowLinks}
		
		props.viewonly = (
			<div>
				{ShowGrade}
			</div>
		);
		
		props.class = cN("content-item", props.class);

		return <ContentSimple {...props} by authors />;
	}
}
