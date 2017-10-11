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

import ContentSimple					from 'com/content-simple/simple';

import $Node							from '../../shrub/js/node/node';
import $NodeMeta						from '../../shrub/js/node/node_meta';
import $Grade							from '../../shrub/js/grade/grade';
import $Asset							from '../../shrub/js/asset/asset';

export default class ContentItem extends Component {
	constructor( props ) {
		super(props);

		var node = props.node;

		this.state = {
			'parent': null,
			'grade': null,

			'linkUrls': [],
			'linkTags': [],
			'linkNames': [],

			'linksShown': 1,

			'allowAnonymous': parseInt(node.meta['allow-anonymous-comments']),
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
		this.onAnonymousComments = this.onAnonymousComments.bind(this);
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

	positionSuffix(position) {
		let j = position % 10;
		let k = position % 100;

		if (j == 1 && k != 11) return "st";
		if (j == 2 && k != 12) return "nd";
		if (j == 3 && k != 13) return "rd";
		return "th";
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

	onAnonymousComments () {
		const anon = this.state.allowAnonymous;
		const node = this.props.node;
		let update = null;
		if (anon) {
			update = $NodeMeta.Remove(node.id, {'allow-anonymous-comments': 0});
		}
		else {
			update = $NodeMeta.Add(node.id, {'allow-anonymous-comments': 1});
		}

		return update.then(r => {
				if ( r && r.changed ) {
					this.setState({'allowAnonymous': !anon});
				}
			});
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
		var LinkMeta = [];

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

		var ShowEventPicker = null;
		if ( extra && extra.length && extra[0] == 'edit' && node_CanPublish(parent) ) {
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

		var ShowMetrics = null;
		if ( node.magic ) {
			let Lines = [];
			for ( var key in node.magic ) {
				let parts = key.split('-');

				// Ignore grades (i.e. grade-01)
				if ( parts.length && !(parts[0] == 'grade' && parts.length > 1) ) {
					Lines.push({'key': key, 'value': node.magic[key]});
				}
			}

			let SimpleLines = [];
			let AdvancedLines = [];
			for ( let idx = 0; idx < Lines.length; idx++ ) {
				let Metric = Lines[idx];

				let Star = false;
				let Warning = false;
				let Icon = null;
				let Title = Metric.key;
				let Score = Metric.value;

				let HoverTitle = Score;

				if ( Metric.key == 'smart' ) {
					Title = "Smart Balance";
					Star = true;
				}
				else if ( Metric.key == 'cool' ) {
					Title = "Classic Balance";
					Star = true;
				}
				else if ( Metric.key == 'grade' ) {
					Title = "Ratings received";
					Warning = Score < 20.0;
					if ( !Warning ) {
						Icon = <SVGIcon baseline small>checkmark</SVGIcon>;
						HoverTitle = "This will be scored";
					}
					else {
						Icon = <SVGIcon baseline small>warning</SVGIcon>;
						HoverTitle = "The minimum needed to score is about 20";
					}
				}
				else if ( Metric.key == 'given' ) {
					Title = "Ratings given";
					if ( Score > 25 ) {
						Icon = <SVGIcon baseline small>checkmark</SVGIcon>;
					}
				}
				else if ( Metric.key == 'feedback' ) {
					Title = "Karma for Feedback given";
				}

				let SmallScore = Score.toFixed(4);
				if ( SmallScore.length > Score.toString().length )
					SmallScore = Score.toString();

				if ( Star )
					AdvancedLines.push(<div class="-metric"><span class="-title">{Title}:</span> <span class="-value" title={HoverTitle}>{SmallScore} *{Icon}</span></div>);
				else
					SimpleLines.push(<div class={cN("-metric", Warning ? "-warning" : "")}><span class="-title">{Title}:</span> <span class="-value" title={HoverTitle}>{SmallScore}{Icon}</span></div>);
			}

			ShowMetrics = (
				<ContentCommonBody class="-rating">
					<div class="-header">Metrics</div>
					<div class="-subtext">Advanced data on this game</div>
					<div class="-items">
						{SimpleLines}
						{AdvancedLines}
					</div>
					<div class="-footer">Metrics update rougly every <strong>15 minutes</strong>. If they don't exactly match other data (i.e. ratings), this is because they haven't updated yet. Metrics with a <strong>*</strong> are dynamic, and change based on a variety of factors. It is normal for these numbers to go up and down.</div>
				</ContentCommonBody>
			);
		}

		var ShowGrade = null;
		// Show Grading or Results
		if ( parseInt(node_CanGrade(parent)) ) {
			// If it's your game, show some stats
			if ( node_IsAuthor(node, user) ) {
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
					let Score = 0;
					if ( node.grade ) {
						Score = node.grade[Line.key];
					}

					//  {Score >= 20 ? <SVGIcon small baseline>check</SVGIcon> : <SVGIcon small baseline>cross</SVGIcon>}

					VoteLines.push(<div class="-grade"><span class="-title">{Title}:</span> <strong>{Score}</strong></div>);
				}

				ShowGrade = (
					<ContentCommonBody class="-rating">
						<div class="-header">Total Ratings</div>
						<div class="-subtext">Votes on your game so far</div>
						<div class="-items">{VoteLines}</div>
						<div class="-footer">To get a score at the end, you need about <strong>20</strong> ratings in a category. To get ratings: play, rate, and leave feedback on games. Every game you rate and leave quality feedback on scores you <strong>Coolness</strong> points. Having a high "Coolness" prioritizes your game.</div>
					</ContentCommonBody>
				);
			}
			// Judging
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
		// Final Results
		else if ( !parseInt(node_CanGrade(parent)) && node_isEventFinished(parent) ) {
			// grading is closed
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

			let ResultLines = [];
			for ( let idx = 0; idx < Lines.length; idx++ ) {
				let Line = Lines[idx];

				let Title = Line.value;
				let Place = "N/A";
				if ( node.magic && node.magic[Line.key+'-result'] )
					Place = node.magic[Line.key+'-result'];
				let Average = 0;
				if ( node.magic && node.magic[Line.key+'-average'] )
					Average = node.magic[Line.key+'-average'];
				let Count = 0;
				if ( node.grade && node.grade[Line.key] )
					Count = node.grade[Line.key];

				//  {Score >= 20 ? <SVGIcon small baseline>check</SVGIcon> : <SVGIcon small baseline>cross</SVGIcon>}

				ResultLines.push(<div class="-grade"><span class="-title">{Title}:</span> <strong>{Place}</strong><sup>{this.positionSuffix(Place)}</sup> ({Average} average from {Count} ratings)</div>);
			}

			ShowGrade = (
				<ContentCommonBody class="-rating">
					<div class="-header">Results</div>
					<div class="-subtext">Final results</div>
					<div class="-items">{ResultLines}</div>
					<div class="-footer">When a line is <strong>N/A</strong>, it means there weren't enough ratings for a reliable score. Don't forget to play and rate other people's games during events to prioritize your game.</div>
				</ContentCommonBody>
			); //'
		}

		var ShowOptOut = null;
		if ( parent && node_CanPublish(parent) ) {
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

		// Where you can enter your game links
		var ShowLinkEntry = null;
		if ( true ) {
			ShowLinkEntry = this.makeLinks(true /* editing */);
		}

		let ShowAnonymousComments = null;
		if ( true ) {
			ShowAnonymousComments = (
				<ContentCommonBody>
					<ContentCommonNavButton onclick={this.onAnonymousComments} class={state.allowAnonymous ? "-selected" : ""}>
						<SVGIcon>warning</SVGIcon>
						<div>Allow anonymous comments</div>
					</ContentCommonNavButton>
					<br />
					Click to <em>{state.allowAnonymous ? "deactivate" : "activate"}</em> anonymous comments.
				</ContentCommonBody>);

		}

		var ShowUploadTips = null;
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

		var ShowLinkView = null;
		if ( true ) {
			ShowLinkView = this.makeLinks(false /* editing */);
		}

		var ShowUnfinished = null;
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
				{ShowAnonymousComments}
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
