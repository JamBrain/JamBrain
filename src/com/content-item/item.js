import { Component } from 'preact';
import './item.less';

import { node_IsPublished, nodeEvent_CanGrade, node_CountAuthors, node_CanPublish, node_IsAuthor, nodeKeys_HasPublishedParent, nodeEvent_IsFinished } from 'internal/lib';

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
import ContentItemFiles from './item-files';
import ContentItemEmbed from './item-embed';
import ContentItemEmbedFile from './item-embed-file';

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

		let {node} = props;

		this.state = {
			/*node: node,*/
			'parent': null,
			'grade': null,

			'linkUrls': [],
			'linkTags': [],
			'linkNames': [],

			'linksShown': 1,

			'allowAnonymous': Number(node.meta['allow-anonymous-comments']),
			'dontRateMe': Number(node.meta['dont-rate-me']),
		};

		for ( let i = 0; i < MAX_LINKS; i++ ) {
			this.state.linkUrls[i] = node.meta['link-0'+(i+1)] ? node.meta['link-0'+(i+1)] : '';
			this.state.linkTags[i] = node.meta['link-0'+(i+1)+'-tag'] ? Number(node.meta['link-0'+(i+1)+'-tag']) : 0;
			this.state.linkNames[i] = node.meta['link-0'+(i+1)+'-name'] ? node.meta['link-0'+(i+1)+'-name'] : '';

			if ( this.state.linkUrls[i] && i+1 > this.state.linksShown ) {
				this.state.linksShown = i+1;
			}
		}

		this.onSetJam = this.onSetJam.bind(this);
		this.onSetCompo = this.onSetCompo.bind(this);
		this.onSetExtra = this.onSetExtra.bind(this);
		this.onSetUnfinished = this.onSetUnfinished.bind(this);

		this.onAnonymousComments = this.onAnonymousComments.bind(this);
		this.onDontRateMe = this.onDontRateMe.bind(this);
		this.onChangeTeam = this.onChangeTeam.bind(this);
		this.handleAllowSubmission = this.handleAllowSubmission.bind(this);
	}


	componentDidMount() {
		let {node} = this.props;


		// Cleverness: All allowed type states default to false (null) if unpublished. If published,
		// they get explicitly set to false, all except for the actual type's state (eg. item/game/compo).
		if (node_IsPublished(node)) {
			this.setState({
				'allowCompo': (node.subsubtype == 'compo'),
				'allowJam': (node.subsubtype == 'jam'),
				'allowExtra': (node.subsubtype == 'extra'),
				'allowUnfinished': (node.subsubtype == 'unfinished'),
			});
		}


		// Once mounted, I need to know my parent
		// MK: TODO: Fetch both parent and author(s)
		// NOTE: If user isn't set before this page renders, my "ratings" will never load
		$Node.Get(node.parent)
		.then(r => {
			if ( r.user && r.user.id && r.node && r.node.length ) {
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


	_setSubSubType( type ) {
		return $Node.Transform(this.props.node.id, 'item', 'game', type)
		.then( r => {
			if ( r && r.changed ) {
				// MK: THIS IS BAD!
				this.props.node.subsubtype = type;
				this.setState({});
			}

			return r;
		});
	}

	onSetJam( e ) {
		return this._setSubSubType('jam')
			.then( r => {
			});
	}
	onSetCompo( e ) {
		return this._setSubSubType('compo')
			.then( r => {
			});
	}
	onSetExtra( e ) {
		return this._setSubSubType('extra')
			.then( r => {
			});
	}
	onSetUnfinished( e ) {
		return this._setSubSubType('unfinished')
			.then( r => {
			});
	}

	onGrade( name, value ) {
		let {node} = this.props;

		return $Grade.Add(node.id, name, value)
			.then(r => {
				if ( (r && r.id) || !!r.changed ) {
					this.setState(prevState => {
						let grade = prevState.grade;

						grade[name] = value;

						return {'grade': grade};
					});
				}
				return r;
			});
	}

	onOptOut( name, value ) {
		let {node} = this.props;

		let Name = name+'-out';
		let Data = {};

		if ( value ) {
			Data[Name] = 1;

			return $Node.AddMeta(node.id, Data)
				.then(r => {
					if ( r && r.changed ) {
						// MK: THIS IS BAD
						this.props.node.meta[Name] = Data[Name];
						this.setState({});
					}
					return r;
				});
		}
		else {
			Data[Name] = 0;

			return $Node.RemoveMeta(node.id, Data)
				.then(r => {
					if ( r && r.changed ) {
						// MK: THIS IS BAD
						this.props.node.meta[Name] = Data[Name];
						this.setState({});
					}
					return r;
				});
		}
	}

	onChangeTeam(userId, action) {
		this.setState(prevState => {
			let team = (prevState.team ? prevState.team : this.props.node.meta.author).map(author => author);
			if (action === 1) {
				if (team.indexOf(userId) === -1) {
					team.push(userId);
				}
			}
			else if (action === -1) {
				team.splice(team.indexOf(userId), 1);
			}

			return {'team': team};
		});
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
						// MK: THIS IS BAD
						this.props.node.meta[name] = FileName;
						this.setState({});
					}
				})
				.catch(err => {
					this.setState({'error': err});
				});
		}
	}

	onAnonymousComments() {
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

	onDontRateMe() {
		const noRate = this.state.dontRateMe;
		const node = this.props.node;

		let update = null;
		if (noRate) {
			update = $Node.RemoveMeta(node.id, {'dont-rate-me': 0});
		}
		else {
			update = $Node.AddMeta(node.id, {'dont-rate-me': 1});
		}

		return update.then(r => {
			if ( r && r.changed ) {
				this.setState({'dontRateMe': !noRate});
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
					// MK: THIS IS BAD
					this.props.node.meta[Base] = Data[Base];
					Changes++;
				}
			}

			{
				let Old = node.meta[Base+'-tag'] ? Number(node.meta[Base+'-tag']) : 0;
				let New = Number(this.state.linkTags[i]);

				if ( Old != New ) {
					Data[Base+'-tag'] = this.state.linkTags[i];
					// MK: THIS IS BAD
					this.props.node.meta[Base+'-tag'] = Data[Base+'-tag'];
					Changes++;
				}
			}

			{
				let Old = node.meta[Base+'-name'] ? node.meta[Base+'-name'] : '';
				let New = this.state.linkNames[i].trim();

				if ( Old != New ) {
					Data[Base+'-name'] = this.state.linkNames[i];
					// MK: THIS IS BAD
					this.props.node.meta[Base+'-name'] = Data[Base+'-name'];
					Changes++;
				}
			}
		}

//		this.setState({});
//		console.log(Data);

		return $Node.AddMeta(node.id, Data);
	}

	// Used by item-rulescheck to enable allowed properties
	handleAllowSubmission(allowed) {
		this.setState(allowed);
	}

	// Generates JSX for the links, depending on whether the page is editing or viewing
	makeLinks( editing ) {
		let LinkMeta = [];

		if ( editing ) {
			LinkMeta.push(
				<div class={`content-common-link -editing -header`}>
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
				<UIButton onClick={e => this.setState({'linksShown': ++this.state.linksShown})} class="content-common-nav-button"><UIIcon src="plus" /><div>Add</div></UIButton>
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

		if ( editing || (this.state.linksShown >= 1) ) {
			return (
				<ContentCommonBody class="-body">
					<div class="-label">Links</div>
					<div class="-items">
						{LinkMeta}
					</div>
				</ContentCommonBody>
			);
		}
		// TODO: return <Fragement />
		return <ContentCommonBody />;
	}


	render( props, state ) {
		props = {...props};			// Copy it because we're going to change it
		let {node, user, path, extra, featured} = props;
		let {parent, team, allowCompo, allowJam, allowExtra, allowUnfinished} = state;
		let shouldCheckRules = true;
		const tooManyAuthorsForCompo = (node_CountAuthors(node) > 1);
		allowCompo = allowCompo && !tooManyAuthorsForCompo;

		let isEditing = extra && extra.length && (extra[0] == 'edit');

		let Category = '/';

		let competitive = false;
		let dontRateMe = state.dontRateMe;
		let canRate = false;

		props.onChangeTeam = this.onChangeTeam;
		if ( team ) {
			props.node.meta.author = team;
		}


		if ( parent ) {
			props.nopublish = !node_CanPublish(parent);
		}

		if ( node ) {
			if ( node.subtype == 'game' ) {
				props.by = "GAME";
				props.flagIcon = "gamepad";
				props.flagClass = "-col-a";
			}
			else if ( node.subtype == 'tool' ) {
				props.by = "TOOL";
				props.flagIcon = "hammer";
				props.flagClass = "-col-c";
			}

			if ( node.subsubtype == 'jam' ) {
				props.by = "JAM "+props.by;
				Category = '/jam';
				//props.nopublish = !allowJam;

				competitive = true;
				canRate = true;
			}
			else if ( node.subsubtype == 'compo' ) {
				props.by = "COMPO "+props.by;
				Category = '/compo';
				//props.nopublish = !allowCompo;

				competitive = true;
				canRate = true;
			}
			else if ( node.subsubtype == 'extra' ) {
				props.by = "EXTRA "+props.by;
				Category = '/extra';
				//props.nopublish = !allowExtra;

				canRate = true;
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
				props.flagClass = null;
				props.by = "UNFINISHED "+props.by;
				Category = '/unfinished';
				//props.nopublish = !allowUnfinished;

				dontRateMe = true;
			}
			else {
				props.nopublish = true;
			}

			props.draft = "Game";
		}

		// NOTE: 'edit' is not the preview (editing) toggle. That is a member of <ContentSimple /> (which we SHOULD derive from)
		let ShowFiles = <ContentItemFiles node={this.props.node} parent={this.state.parent} user={this.props.user} edit={isEditing} />;
		// HACK because we don't know if we're editing or not
		let ShowFilesView = <ContentItemFiles node={this.props.node} parent={this.state.parent} user={this.props.user} />;

		let ShowEmbedFile = <ContentItemEmbedFile node={this.props.node} parent={this.state.parent} user={this.props.user} edit={isEditing} />;
		let ShowEmbedView = <ContentItemEmbed node={this.props.node} parent={this.state.parent} user={this.props.user} />;

		// Event Picker
		let ShowEventPicker = null;
		let ShowRulesCheck = null;
		if ( isEditing && node_CanPublish(parent) ) {
			ShowRulesCheck = <ContentItemRulesCheck node={this.props.node} parent={this.state.parent} onAllowChange={this.handleAllowSubmission} answers={state.rulesAnswers} />;
			ShowEventPicker = (
				<ContentCommonBody class="-body">
					<div class="-label">Event Format Selection</div>
					<p>
						<span>Choose the event format of your game</span>
					</p>
					<ContentCommonNav>
						<ContentCommonNavButton onClick={this.onSetJam} class={node.subsubtype == 'jam' ? "-selected" : ""} disabled={!allowJam}><UIIcon src="users" /><div>Jam</div></ContentCommonNavButton>
						<ContentCommonNavButton onClick={this.onSetCompo} class={node.subsubtype == 'compo' ? "-selected" : ""} disabled={!allowCompo}><UIIcon src="user" /><div>Compo</div></ContentCommonNavButton>
						<ContentCommonNavButton onClick={this.onSetExtra} class={node.subsubtype == 'extra' ? "-selected" : ""} disabled={!allowExtra}><UIIcon src="users" /><div>Extra</div></ContentCommonNavButton>
						<ContentCommonNavButton onClick={this.onSetUnfinished} class={node.subsubtype == 'unfinished' ? "-selected" : ""} disabled={!allowUnfinished}><UIIcon src="trash" /><div>Unfinished</div></ContentCommonNavButton>
					</ContentCommonNav>
					<div class="-info">
						{tooManyAuthorsForCompo && <div class="-warning"><UIIcon baseline small src="warning" /> COMPO unavailable: Too many authors.</div>}
					</div>
					<div class="-footer">
						<p>
							<UIIcon baseline small src="info" />
							<span>If a button is disabled, you haven't checked-off enough items in the <strong>Submission Checklist</strong> above to qualify for the category.</span>
						</p>
						<p>
							If your event format is correct (filled background), you <strong>don't</strong> need to change or update this.
						</p>
						<p>
							<UIIcon baseline src="warning" class="-warning" />
							<span> <strong>IMPORTANT:</strong> You can't <strong>Publish</strong> until you finish this step!</span>
						</p>
					</div>
				</ContentCommonBody>
			);
		}

		// Metrics
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
					if ( dontRateMe ) {
						continue;
					}

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
					Title = "Karma from Feedback given";
				}

				let SmallScore = Score.toFixed(4);
				if ( SmallScore.length > Score.toString().length )
					SmallScore = Score.toString();

				if ( Star )
					AdvancedLines.push(<div class="-metric"><span class="-title">{Title}:</span> <span class="-value" title={HoverTitle}>{SmallScore} *{Icon}</span></div>);
				else
					SimpleLines.push(<div class={`-metric ${Warning ? "-warning" : ''}`}><span class="-title">{Title}:</span> <span class="-value" title={HoverTitle}>{SmallScore}{Icon}</span></div>);
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

        const urlParams = new URLSearchParams(window.location.search);
		const requestAdmin = Number(urlParams.get('admin'));
		const isAdmin = user && user.private && user.private.meta && user.private.meta.admin;

//		if (isAdmin) {
//			console.log("Requested Admin Display: " + requestAdmin);
//		}


		// Ratings/Grading/Results
		let ShowGrade = null;
		// If grading is enabled
		if ( !(isAdmin && requestAdmin) && nodeEvent_CanGrade(parent) ) {
			// My game
			if ( node_IsAuthor(node, user) ) {
				// Only show Total Ratings for competitive events
				if ( canRate && competitive ) {
					let Lines = [];

					// For all the parent's metadata
					for ( var key in parent.meta ) {
						// Is this meta a grade (i.e. grade-01)?
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

						//  {Score >= 20 ? <UIIcon small baseline>check</UIIcon> : <UIIcon small baseline>cross</UIIcon>}

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
			}
			// Other games
			else if ( featured && featured.what && nodeKeys_HasPublishedParent(featured.what, node.parent) ) {

				if ( canRate && !dontRateMe ) {
					let Lines = [];

					if ( parent && parent.meta ) {
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
					}

					let VoteLines = [];
					for ( let idx = 0; idx < Lines.length; idx++ ) {
						let Line = Lines[idx];

						let Title = Line.value;
						let Score = '?';
						if ( state.grade ) {
							Score = state.grade[Line.key] ? state.grade[Line.key] : 0;
						}

						VoteLines.push(
							<div class="-grade">
								<span class="-title">{Title}:</span>
								<InputStar value={Score} onClick={this.onGrade.bind(this, Line.key)} ondelete={this.onGrade.bind(this, Line.key, 0)} edit delete number />
							</div>
						);
					}

					let ShowRatingSubText = null;
					if ( node.subsubtype == 'jam' )
						ShowRatingSubText = <div class="-subtext">Jam game</div>;
					else if ( node.subsubtype == 'compo' )
						ShowRatingSubText = <div class="-subtext">Compo game</div>;
					else if ( node.subsubtype == 'extra' )
						ShowRatingSubText = <div class="-subtext">Extra game</div>;

					ShowGrade = (
						<ContentCommonBody class="-rating -body">
							<div class="-header">Ratings</div>
							{ShowRatingSubText}
							<div class="-items">{VoteLines}</div>
							<div class="-footer">Ratings are saved automatically when you click. When they change, they're saved.</div>
						</ContentCommonBody>
					);
				}

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
		// Final Results, grading is closed
		else if ( (isAdmin && requestAdmin) || (!nodeEvent_CanGrade(parent) && nodeEvent_IsFinished(parent)) ) {
			if ( canRate && !dontRateMe ) {
				let Lines = [];

				if ( parent && parent.meta ) {
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

					//  {Score >= 20 ? <UIIcon small baseline>check</UIIcon> : <UIIcon small baseline>cross</UIIcon>}

					ResultLines.push(<div class="-grade"><span class="-title">{Title}:</span> <strong>{Place}</strong><sup>{this.positionSuffix(Place)}</sup> ({Average} average from {Count} ratings)</div>);
				}

				ShowGrade = (
					<ContentCommonBody class="-rating -body">
						<div class="-header">Results</div>
						<div class="-subtext">Final results</div>
						<div class="-items">{ResultLines}</div>
						<div class="-footer">When a line is <strong>N/A</strong>, it means there weren't enough ratings for a reliable score. Don't forget to play and rate other people's games during events to prioritize your game.</div>
					</ContentCommonBody>
				);
			}
		}

		let ShowOptOut = null;
		// Check state.dontRateMe instead of dontRateMe, so the options are only hidden if opted out of everything
		if ( parent && !state.dontRateMe ) {
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
							'value': (node.meta ? node.meta[BaseKey+'-out'] : false),
							'required': parent.meta[BaseKey+"-required"] === "1",
						});
					}
				}
			}

			let OptLines = [];

			for ( let idx = 0; idx < Lines.length; idx++ ) {
				let Line = Lines[idx];
				OptLines.push(<UICheckbox onClick={this.onOptOut.bind(this, Line.key, !Line.value)} value={Line.value}>Do not rate me in <strong>{Line.name}</strong>{Line.required ? " (required, see below)" : ""}</UICheckbox>);
			}

			ShowOptOut = (
				<ContentCommonBody class="-opt-out -body">
					<div class="-label">Rating Category Opt-outs</div>
					{OptLines}
					<div class="-footer">
						<p>
							<span>Opt-out of categories here if you and your team didn't make all your graphics, audio, or music during the event.
							Many participants are making original graphics, audio and music from scratch during the event. As a courtesy, we ask you to opt-out if you didn't do the same. See <UILink href="http://ludumdare.com/rules/">the rules</UILink>.</span>
						</p>
						<p>
							<span>Since some games are not meant to be Funny or Moody, or they don't make good use of the theme, you can choose to opt-out of these categories too. Opting out of these is optional.</span>
						</p>
						<p>
							<UIIcon small baseline src="info" />
							<span>NOTE: If you opted out of a category by mistake, you may need more ratings to ensure you get a score in that category.</span>
						</p>
					</div>
				</ContentCommonBody>
			);
		}

		let ShowImages = null;
		if ( true ) {
			let ShowImage = null;
			if ( node.meta && node.meta.cover ) {
				ShowImage = <UIImage class="-img" src={node.meta && node.meta.cover ? node.meta.cover+'.320x256.fit.jpg' : "" } />;
			}

			ShowImages = (
				<ContentCommonBody class="-images -body">
					<div class="-label">Cover Image</div>
					<div class="-upload -items">
						<div class="-path">{node.meta && node.meta.cover ? node.meta.cover : "" }</div>
						<label>
							<input type="file" name="asset" style="display: none;" onChange={this.onUpload.bind(this, 'cover')} />
							<ButtonBase class="-button"><UIIcon small baseline gap>upload</UIIcon>Upload</ButtonBase>
						</label>
						{ShowImage}
					</div>
					<div class="-footer">
						<div><UIIcon small baseline src="info" /> Recommended Size: 640x512 (i.e. 5:4 aspect ratio). Other sizes will be scaled+cropped to fit. GIFs will not animate.</div>
					</div>
				</ContentCommonBody>
			);
		}

		// Where you can enter your game links
		let ShowLinkEntry = null;
		if ( true ) {
			ShowLinkEntry = this.makeLinks(true /* editing */);
		}

		let ShowDontRateMe = null;
		if ( true ) {
			ShowDontRateMe = (
				<ContentCommonBody class="-show-comments -body">
					<div class="-label">Casual</div>
					<div class="-items">
						<UICheckbox onClick={this.onDontRateMe} value={state.dontRateMe}>Opt-out of ratings</UICheckbox>
					</div>
					<div class="-footer">
						<UIIcon small baseline src="info" />
						<span>If you'd like to entirely opt-out of ratings, choose this, and the Extra format below.</span>
					</div>
				</ContentCommonBody>
			);
		}

		let ShowAnonymousComments = null;
		if ( true ) {
			ShowAnonymousComments = (
				<ContentCommonBody class="-show-comments -body">
					<div class="-label">Feedback</div>
					<div class="-items">
						<UICheckbox onClick={this.onAnonymousComments} value={state.allowAnonymous}>Allow anonymous comments <UIIcon src="warning" title="Do this at your own risk" /></UICheckbox>
					</div>
					<div class="-footer">
						<UIIcon small baseline src="info" />
						<span>You should only do this if you want the most critical of feedback.</span>
					</div>
				</ContentCommonBody>
			);
		}

		let ShowUploadTips = null;
		/*if ( true ) {
			ShowUploadTips = (
				<ContentCommonBody class="-hosting -body">
					<div class="-footer">
						<UIIcon small baseline src="info" />
						<span>If you're new to Ludum Dare, you should know we don't host downloads, we link to them. Check out the <UILink blank href="/events/ludum-dare/hosting-guide">Hosting Guide</UILink>.</span>
					</div>
				</ContentCommonBody>
			);
		}*/

		let ShowLinkView = null;
		if ( true ) {
			ShowLinkView = this.makeLinks(false /* editing */);
		}

		let ShowPostTips = null;
		if ( true ) {
			ShowPostTips = (
				<ContentCommonBody class="-body">
					<div class="-footer">
						<div><UIIcon small baseline src="info" /> Add screenshots to your description via the <strong>Upload Image</strong> link above. Keep GIFs less than 640 pixels wide.</div>
						<div><UIIcon small baseline src="info" /> You can embed <UILink href="https://youtube.com">YouTube</UILink> video in your description by pasting a YouTube link on a blank line ("embed code" not required).</div>
					</div>
				</ContentCommonBody>
			);
		}

		props.editonly = (
			<div>
				{ShowPostTips}
				{ShowImages}
				{ShowEmbedFile}
				{ShowFiles}
				{ShowLinkEntry}
				{ShowUploadTips}
				{ShowAnonymousComments}
				{ShowDontRateMe}
				{ShowOptOut}
				{ShowRulesCheck}
				{ShowEventPicker}
			</div>
		);
		props.onSave = this.onSave.bind(this);

		//if ( !isEditing ) {
			props.prefix = ShowEmbedView;
		//}

		props.viewonly = (
			<div>
				{ShowFilesView}
				{ShowLinkView}
				{ShowGrade}
				{ShowMetrics}
			</div>
		);

		props.class = `content-item ${props.class ?? ''}`;

		// Shim to update the save button from this method. See https://facebook.github.io/react/docs/refs-and-the-dom.html
		props.ref = c => {
			this.contentSimple = c;
		};

		return <ContentSimple {...props} authors key={props.node.id} />;
	}
}
