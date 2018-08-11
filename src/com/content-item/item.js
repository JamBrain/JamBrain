import {h, Component} 					from 'preact/preact';

import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import IMG2 							from 'com/img2/img2';

import UIIcon 							from 'com/ui/icon/icon';
import UIImage 							from 'com/ui/image/image';
import UILink 							from 'com/ui/link/link';

import ButtonBase						from 'com/button-base/base';
import UIButton							from 'com/ui/button/button';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyField			from 'com/content-common/common-body-field';
import ContentCommonBodyLink			from 'com/content-common/common-body-link';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonNav					from 'com/content-common/common-nav';
import ContentCommonNavButton			from 'com/content-common/common-nav-button';

import ContentItemRulesCheck 			from 'com/content-item/item-rulescheck';

import InputStar						from 'com/input-star/star';

import UICheckbox						from 'com/ui/checkbox/checkbox';

import ContentSimple					from 'com/content-simple/simple';

import $Node							from 'shrub/js/node/node';
import $Grade							from 'shrub/js/grade/grade';
import $Asset							from 'shrub/js/asset/asset';

const MAX_LINKS = 9;

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

		for ( let i = 0; i < MAX_LINKS; i++ ) {
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
		this.onChangeTeam = this.onChangeTeam.bind(this);
		this.handleAllowSubmission = this.handleAllowSubmission.bind(this);
	}

	componentDidMount() {
		var node = this.props.node;

		if (node_IsPublished(node)) {
			this.setState({
				'allowCompo': (node.subsubtype == 'compo'),
				'allowJam': (node.subsubtype == 'jam'),
				'allowUnfinished': (node.subsubtype == 'unfinished'),
			});
		}

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
			this.setState({'error': err});
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
		let Node = this.props.node;

		return $Grade.Add(Node.id, name, value)
			.then(r => {
				if ( (r && r.id) || !!r.changed ) {
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

			return $Node.AddMeta(Node.id, Data)
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

			return $Node.RemoveMeta(Node.id, Data)
				.then(r => {
					if ( r && r.changed ) {
						this.props.node.meta[Name] = Data[Name];
						this.setState({});
					}
					return r;
				});
		}
	}

	onChangeTeam(userId, action) {
		let team = (this.state.team ? this.state.team : this.props.node.meta.author).map(author => author);
		if (action === 1) {
			if (team.indexOf(userId) === -1)
				team.push(userId);
		}
		else if (action === -1) {
			team.splice(team.indexOf(userId), 1);
		}
		this.setState({'team': team});
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

						return $Node.AddMeta(node.id, Data);
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
					this.setState({'error': err});
				});
		}
	}

	onAnonymousComments () {
		const anon = this.state.allowAnonymous;
		const node = this.props.node;
		let update = null;
		if (anon) {
			update = $Node.RemoveMeta(node.id, {'allow-anonymous-comments': 0});
		}
		else {
			update = $Node.AddMeta(node.id, {'allow-anonymous-comments': 1});
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

	onModifyLinkTag( index, tagId ) {
		const tags = this.state.linkTags.slice();
		tags[index] = tagId;
		this.setState({'modified': true, 'linkTags': tags});
		this.contentSimple.setState({'modified': true});
	}

	onModifyLinkUrl( Index, e ) {
		var URLs = this.state.linkUrls;
		URLs[Index] = e.target.value;
		this.setState({'modified': true, 'linkUrls': URLs});
		// Update save button
		this.contentSimple.setState({'modified': true});
	}

	onRemoveLink( index ) {
		const {linkTags, linkNames, linkUrls, linksShown} = this.state;
		if ((index < 0) || (index >= linkTags.length)) return;

		// Never modify existing state directly and splice is in place
		const newTags = linkTags.slice();
		const newUrls = linkUrls.slice();
		const newNames = linkNames.slice();

		newTags.splice(index, 1);
		newUrls.splice(index, 1);
		newNames.splice(index, 1);

		this.setState({
			"linkTags": newTags,
			"linkNames": newNames,
			"linkUrls": newUrls,
			"linksShown": Math.max(linksShown - 1, 1),
		});
		this.contentSimple.setState({'modified': true});
	}

	onSave( e ) {
		let {node, user} = this.props;

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

		return $Node.AddMeta(node.id, Data);
	}

	handleAllowSubmission(allowed) {
		this.setState(allowed);
	}

	// Generates JSX for the links, depending on whether the page is editing or viewing
	makeLinks( editing ) {
		let LinkMeta = [];

		if ( editing ) {
			LinkMeta.push(
				<div class={cN('content-common-link', '-editing', '-header')}>
					<div class="-tag">Platform</div>
					<div class="-name">Description (optional)</div>
					<div class="-url">URL (leave blank to omit)</div>
				</div>
			);
		}

		for ( let idx = 0; idx < this.state.linksShown; idx++ ) {
			LinkMeta.push(
				<ContentCommonBodyLink
					name={this.state.linkNames[idx]}
					tag={this.state.linkTags[idx]}
					url={this.state.linkUrls[idx]}
					urlPlaceholder="http://example.com/file.zip"
					editing={editing}
					filter="platform"
					onModifyName={this.onModifyLinkName.bind(this, idx)}
					onModifyTag={this.onModifyLinkTag.bind(this, idx)}
					onModifyUrl={this.onModifyLinkUrl.bind(this, idx)}
					onRemove={this.onRemoveLink.bind(this, idx)}
					defaultIndex={idx}
					defaultValue={50}
					defaultText="Source Code"
				/>
			);
		}

		if ( editing && this.state.linksShown < MAX_LINKS ) {
			LinkMeta.push(
				<UIButton onclick={e => this.setState({'linksShown': ++this.state.linksShown})} class="content-common-nav-button"><UIIcon src="plus" /><div>Add</div></UIButton>
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
			<ContentCommonBody class="-body">
				<div class="-label">Downloads and Links</div>
				<div class="-items">
					{LinkMeta}
				</div>
			</ContentCommonBody>
		);
	}

	render( props, state ) {
		props = Object.assign({}, props);			// Copy it because we're going to change it
		let {node, user, path, extra, featured} = props;
		let {parent, team, allowCompo, allowJam, allowUnfinished} = state;
		let shouldCheckRules = true;
		const tooManyAuthorsForCompo = (node_CountAuthors(node) > 1);
		allowCompo = allowCompo && !tooManyAuthorsForCompo;

		let Category = '/';

		props.onChangeTeam = this.onChangeTeam;
		if (team) {
			props.node.meta.author = team;
		}


		if ( parent ) {
			props.nopublish = !node_CanPublish(parent);
		}

		if ( node ) {
			if ( node.subtype == 'game' ) {
				props.by = "GAME";
				props.headerIcon = "gamepad";
				props.headerClass = "-col-a";
			}
			else if ( node.subtype == 'tool' ) {
				props.by = "TOOL";
				props.headerIcon = "hammer";
				props.headerClass = "-col-c";
			}

			if ( node.subsubtype == 'jam' ) {
				props.by = "JAM "+props.by;
				Category = '/jam';
				//props.nopublish = !allowJam;
			}
			else if ( node.subsubtype == 'compo' ) {
				props.by = "COMPO "+props.by;
				Category = '/compo';
				//props.nopublish = !allowCompo;
			}
			else if ( node.subsubtype == 'craft' ) {
				props.by = "CRAFT";
				Category = '/craft';
			}
			else if ( node.subsubtype == 'release' ) {
				props.by = "RELEASED "+props.by;
				Category = '/release';
			}
			else if ( node.subsubtype == 'unfinished' ) {
				props.headerClass = null;
				props.by = "UNFINISHED "+props.by;
				Category = '/unfinished';
				//props.nopublish = !allowUnfinished;
			}
			else {
				props.nopublish = true;
			}

			props.draft = "Game";
		}

		let ShowEventPicker = null;
		let ShowRulesCheck = null;
		if ( extra && extra.length && (extra[0] == 'edit') && node_CanPublish(parent) ) {
			ShowRulesCheck = <ContentItemRulesCheck node={this.props.node} onAllowChange={this.handleAllowSubmission} answers={state.rulesAnswers} />;
			ShowEventPicker = (
				<ContentCommonBody class="-body">
					<div class="-label">Event Selection</div>
					<ContentCommonNav>
						<ContentCommonNavButton onclick={this.onSetJam} class={node.subsubtype == 'jam' ? "-selected" : ""} disabled={!allowJam}><UIIcon src="users" /><div>Jam</div></ContentCommonNavButton>
						<ContentCommonNavButton onclick={this.onSetCompo} class={node.subsubtype == 'compo' ? "-selected" : ""} disabled={!allowCompo}><UIIcon src="user" /><div>Compo</div></ContentCommonNavButton>
						<ContentCommonNavButton onclick={this.onSetUnfinished} class={node.subsubtype == 'unfinished' ? "-selected" : ""} disabled={!allowUnfinished}><UIIcon src="trash" /><div>Unfinished</div></ContentCommonNavButton>
					</ContentCommonNav>
					<div class="-info">
						{tooManyAuthorsForCompo && <div class="-warning"><UIIcon baseline small src="warning" /> COMPO unavailable: Too many authors.</div>}
					</div>
					<div class="-footer">
						<UIIcon baseline small src="info" />
						<span>Select the event you are participating in. If the buttons are grayed out, then you haven't checked-off enough items in the Submission Checklist above. <strong>IMPORTANT:</strong> You can't <strong>Publish</strong> until you finish this step!</span>
					</div>
				</ContentCommonBody>
			);
		}

		let ShowMetrics = null;
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
						Icon = <UIIcon baseline small src="checkmark" />;
						HoverTitle = "This will be scored";
					}
					else {
						Icon = <UIIcon baseline small src="warning" />;
						HoverTitle = "The minimum needed to score is about 20";
					}
				}
				else if ( Metric.key == 'given' ) {
					Title = "Ratings given";
					if ( Score > 25 ) {
						Icon = <UIIcon baseline small src="checkmark" />;
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
				<ContentCommonBody class="-rating -body">
					<div class="-header">Metrics</div>
					<div class="-subtext">Advanced data on this game</div>
					<div class="-items">
						{SimpleLines}
						{AdvancedLines}
					</div>
					<div class="-footer">Metrics update roughly every <strong>15 minutes</strong>. If they don't exactly match other data (i.e. ratings), this is because they haven't updated yet. Metrics with a <strong>*</strong> are dynamic, and change based on a variety of factors. It is normal for these numbers to go up and down.</div>
				</ContentCommonBody>
			);
		}

		let ShowGrade = null;
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
					<ContentCommonBody class="-rating -body">
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

//					let Stars = [];
//					for ( let idx2 = 0; idx2 < Score; idx2++ ) {
//						Stars.push(<ButtonBase class="-star" onclick={this.onGrade.bind(this, Line.key, idx2+1)}><SVGIcon small baseline>star-full</SVGIcon></ButtonBase>);
//					}
//					for ( let idx2 = Score; idx2 < 5; idx2++ ) {
//						Stars.push(<ButtonBase class="-star" onclick={this.onGrade.bind(this, Line.key, idx2+1)}><SVGIcon small baseline>star-empty</SVGIcon></ButtonBase>);
//					}
//					Stars.push(<ButtonBase class="-delete" onclick={this.onGrade.bind(this, Line.key, 0)}><SVGIcon small>cross</SVGIcon></ButtonBase>);

//					Stars.push(<InputStar value='2.5' max='5' small number />);
//					Stars.push(<InputStar value='2.5' max='5' number />);
//					Stars.push(<InputStar value={Score} onclick={this.onGrade.bind(this, Line.key)} ondelete={this.onGrade.bind(this, Line.key, 0)} edit delete number />);

					VoteLines.push(
						<div class="-grade">
							<span class="-title">{Title}:</span>
							<InputStar value={Score} onclick={this.onGrade.bind(this, Line.key)} ondelete={this.onGrade.bind(this, Line.key, 0)} edit delete number />
						</div>
					);
				}

				let ShowRatingSubText = null;
				if ( node.subsubtype == 'jam' )
					ShowRatingSubText = <div class="-subtext">Jam game</div>;
				else if ( node.subsubtype == 'compo' )
					ShowRatingSubText = <div class="-subtext">Compo game</div>;

				ShowGrade = (
					<ContentCommonBody class="-rating -body">
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
					<ContentCommonBody class="-rating -body">
						<div class="-header">Ratings</div>
						<div class="-items">Please login to rate this game</div>
					</ContentCommonBody>
				);
			}
			else {
				ShowGrade = (
					<ContentCommonBody class="-rating -body">
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
				<ContentCommonBody class="-rating -body">
					<div class="-header">Results</div>
					<div class="-subtext">Final results</div>
					<div class="-items">{ResultLines}</div>
					<div class="-footer">When a line is <strong>N/A</strong>, it means there weren't enough ratings for a reliable score. Don't forget to play and rate other people's games during events to prioritize your game.</div>
				</ContentCommonBody>
			); //'
		}

		let ShowOptOut = null;
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
							'value': (node.meta ? node.meta[BaseKey+'-out'] : false)
						});
					}
				}
			}

			let OptLines = [];

			for ( let idx = 0; idx < Lines.length; idx++ ) {
				let Line = Lines[idx];
				OptLines.push(<UICheckbox onclick={this.onOptOut.bind(this, Line.key, !Line.value)} value={Line.value}>Do not rate me in <strong>{Line.name}</strong></UICheckbox>);
			}

			ShowOptOut = (
				<ContentCommonBody class="-opt-out -body">
					<div class="-label">Voting Category Opt-outs</div>
					{OptLines}
					<div class="-footer">
						<UIIcon small baseline src="info" />
						<span>Opt-out of categories here if you and your team didn't make all your graphics, audio, or music during the event.
						Many participants are making original graphics, audio and music from scratch during the event. As a courtesy, we ask you to opt-out if you didn't do the same.
						Also, some games are not meant to be Humourous or Moody, so you can choose to opt-out of these too.</span>
					</div>
				</ContentCommonBody>
			);
		}

		let ShowImages = null;
		if ( true ) {
			let ShowImage = null;
			if ( node.meta && node.meta.cover ) {
				ShowImage = <IMG2 class="-img" src={node.meta && node.meta.cover ? node.meta.cover+'.320x256.fit.jpg' : "" } />;
			}

			ShowImages = (
				<ContentCommonBody class="-images -body">
					<div class="-label">Cover Image</div>
					<div class="-upload -items">
						<div class="-path">{node.meta && node.meta.cover ? node.meta.cover : "" }</div>
						<label>
							<input type="file" name="asset" style="display: none;" onchange={this.onUpload.bind(this, 'cover')} />
							<ButtonBase class="-button"><SVGIcon small baseline gap>upload</SVGIcon>Upload</ButtonBase>
						</label>
						{ShowImage}
					</div>
					<div class="-footer">
						<UIIcon small baseline src="info" />
						<span>Recommended Size: 640x512 (i.e. 5:4 aspect ratio). Other sizes will be scaled+cropped to fit. Animated GIFs will not work here.</span>
					</div>
				</ContentCommonBody>
			);
		}

		// Where you can enter your game links
		let ShowLinkEntry = null;
		if ( true ) {
			ShowLinkEntry = this.makeLinks(true /* editing */);
		}

		let ShowAnonymousComments = null;
		if ( true ) {
			ShowAnonymousComments = (
				<ContentCommonBody class="-show-comments -body">
					<div class="-label">Feedback</div>
					<div class="-items">
						<UICheckbox onclick={this.onAnonymousComments} value={state.allowAnonymous}>Allow anonymous comments <UIIcon src="warning" title="Do this at your own risk" /></UICheckbox>
					</div>
					<div class="-footer">
						<UIIcon small baseline src="info" />
						<span>You should only do this if you want the most critical of feedback.</span>
					</div>
				</ContentCommonBody>
			);
		}

		let ShowUploadTips = null;
		if ( true ) {
			ShowUploadTips = (
				<ContentCommonBody class="-hosting -body">
					<div class="-footer">
						<UIIcon small baseline src="info" />
						<span>If you're new to Ludum Dare, you should know we don't host downloads, we link to them. Check out the <UILink blank href="/events/ludum-dare/hosting-guide">Hosting Guide</UILink>.</span>
					</div>
				</ContentCommonBody>
			);
		}

		let ShowLinkView = null;
		if ( true ) {
			ShowLinkView = this.makeLinks(false /* editing */);
		}

		let ShowPostTips = null;
		if ( true ) {
			ShowPostTips = (
				<ContentCommonBody class="-body">
					<div class="-footer">
						<UIIcon small baseline src="info" />
						<span>Add screenshots to your description via the <strong>Upload Image</strong> link above. Try to keep your GIFs less than 640 pixels wide.
						You can embed <UILink href="https://youtube.com">YouTube</UILink> video in your description by pasting a YouTube link on a blank line ("embed code" not required).</span>
					</div>
				</ContentCommonBody>
			);
		}

		props.editonly = (
			<div>
				{ShowPostTips}
				{ShowImages}
				{ShowLinkEntry}
				{ShowUploadTips}
				{ShowAnonymousComments}
				{ShowOptOut}
				{ShowRulesCheck}
				{ShowEventPicker}
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
		props.ref = c => {
			this.contentSimple = c;
		};

		return <ContentSimple {...props} authors />;
	}
}
