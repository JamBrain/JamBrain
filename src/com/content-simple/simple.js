import {h, Component} 					from 'preact/preact';

import NavLink							from 'com/nav-link/link';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyBy				from 'com/content-common/common-body-by';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyMarkup			from 'com/content-common/common-body-markup';

import ContentCommonDraft				from 'com/content-common/common-draft';

import ContentCommonEdit				from 'com/content-common/common-edit';

import $Node							from '../../shrub/js/node/node';


export default class ContentSimple extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'author': {},
			'authors': [],

			'editing': this.isEditMode(),
			'modified': false,

			'name': props.node.name,
			'body': props.node.body,
			'avatar': '',
		};

		this.onEdit = this.onEdit.bind(this);
		this.onPreview = this.onPreview.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onPublish = this.onPublish.bind(this);

		this.onModifyTitle = this.onModifyTitle.bind(this);
		this.onModifyText = this.onModifyText.bind(this);
		this.onModifyAvatar = this.onModifyAvatar.bind(this);
	}

	componentDidMount() {
		var props = this.props;

		if ( props.authored )
			this.getAuthor(props.node);
		if ( props.authors )
			this.getAuthors(props.node);
	}

	componentWillUpdate( newProps, newState ) {
		//Editing is done in constructor and since this isn't reloaded in most instances it requires a hack
		let editingNext = newProps.extra && newProps.extra.length && (newProps.extra[newProps.extra.length-1] == 'edit');
		if ( editingNext && !this.isEditMode() ) {
			this.setState({'editing': true});
		}

		if ( this.props.node !== newProps.node ) {
			if ( this.props.authored ) {
				this.getAuthor(newProps.node);
			}
			if ( this.props.authors ) {
				this.getAuthors(newProps.node);
			}
		}
	}

	getAuthors( node ) {
		// Clear the Authors
//		this.setState({ authors: [] });

		if ( node.meta && node.meta['author'] ) {
			// Lookup the authors
			$Node.Get( node.meta['author'] )
			.then(r => {
				if ( r.node && r.node.length ) {
					this.setState({'authors': r.node});
				}
				else {
					this.setState({'error': "Authors not found"});
				}
			})
			.catch(err => {
				this.setState({'error': err});
			});
		}
	}

	getAuthor( node ) {
		// Clear the Author
//		this.setState({ author: {} });

		// Lookup the author
		$Node.Get( node.author )
		.then(r => {
			if ( r.node && r.node.length ) {
				var author = r.node[0];
				this.setState({'author': author, 'avatar': (author && author.meta && author.meta.avatar) ? author.meta.avatar : ''});
			}
			else {
				this.setState({'error': "Author not found"});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	onEdit( e ) {
		this.setState({'editing': true});
	}
	onPreview( e ) {
		this.setState({'editing': false});
	}
	onSave( e ) {
		var Title = this.state.name ? this.state.name : this.props.node.name;
		var Body = this.state.body ? this.state.body : this.props.node.body;

		if (this.props.onSave) {
			this.props.onSave( e );
		}

		return $Node.Update(this.props.node.id, Title, Body)
		.then(r => {
			if ( r.status == 200 ) {
				this.setState({'modified': false});
				return true;
			}
			else {
				if ( (r.caller_id == 0) || (r.data && (r.data.caller_id == 0)) ) {
					location.hash = "#savebug";
				}
				else {
					this.setState({'error': r.status + ": " + r.error});
				}
			}
			return false;
		})
		.catch(err => {
			console.log(err);
			this.setState({'error': err});
		});
	}
	onPublish( e ) {
		// TODO: Confirm
		console.log('do save first');
		return this.onSave( e ).then( rr => {
			if ( rr ) {
				console.log('do publish');
				$Node.Publish(this.props.node.id)
				.then(r => {
					console.log(r);
					if ( (r.status == 200) && r.path ) {
						window.location.href = r.path;
	//					this.setState({ 'modified': false });
					}
	//			else {
	//				if ( r.caller_id == 0 || (r.data && r.data.caller_id == 0) ) {
	//					location.hash = "#savebug";
	//				}
	//				else {
	//					this.setState({ 'error': r.status + ": " + r.error });
	//				}
	//			}
				})
				.catch(err => {
					console.log(err);
					this.setState({'error': err});
				});
			}
		});
	}

	onModifyTitle( e ) {
		this.setState({'modified': true, 'name': e.target.value});
	}
	onModifyText( e ) {
		this.setState({'modified': true, 'body': e.target.value});
	}
	onModifyAvatar( avatar ) {
		this.setState({/*'modified': true,*/'avatar': avatar});
	}

	isEditMode() {
		let {extra} = this.props;
		return extra && extra.length && (extra[extra.length-1] == 'edit');
	}

	render( props, state ) {
		let {node, user, path, extra} = props;
		let {author, authors} = state;
		props = Object.assign({}, props);	// Shallow copy we can change props


		if ( node && ((node.slug && !props.authored && !props.authors) || (node.slug && author && author.slug)) || (node.slug && authors.length) ) {
			var ShowEditBar = null;
			var ShowOnly = null;

			if ( this.isEditMode() ) {
				if ( !node_IsAuthor(node, user) ) {
					return <ContentError code="403">Forbidden: You do not have permission to edit this</ContentError>;
				}

				let EditProps = {
					'editing': state.editing,
					'modified': state.modified,
					'published': !!node.published,
					'onedit': this.onEdit,
					'onpreview': this.onPreview,
					'onsave': this.onSave,
					'onpublish': this.onPublish,
				};

				EditProps.nopublish = props.nopublish;

				ShowEditBar = <ContentCommonEdit {...EditProps} />;
			}
			else {
				if ( node_IsAuthor(node, user) ) {
					props.edit = 1;
				}
			}

			let ShowAvatar = null;
			let ShowByLine = null;
			if ( props.authored ) {
				ShowAvatar = <ContentCommonBodyAvatar node={node} user={user} src={state.avatar} editing={node_IsAuthor(node, user) ? state.editing : false} onchange={this.onModifyAvatar} />;
				if ( props.by && !(props.notitleedit ? false : state.editing) ) {
					ShowByLine = <ContentCommonBodyBy node={node} author={author} label={props.by.length ? props.by : "published"} noby={props.noby} when />;
				}
			}
			else if ( props.authors ) {
				if ( props.by && !state.editing ) {
					ShowByLine = <ContentCommonBodyBy node={node} authors={authors} />;
				}
				else {
					ShowByLine = (
						<div class="content-common-body">
							<div class="-label">Authors</div>
							Visit <NavLink blank href={user.path+'/following'}>your userpage</NavLink> to add authors. <br />
							<strong>NOTE:</strong> You can only add friends (users that follow each other).
						</div>
					);
				}
			}
			else if ( props.updated && !state.editing ) {
				ShowByLine = <ContentCommonBodyBy node={node} label="Last updated" modified />;
			}

			if ( state.editing && props.editonly ) {
				ShowOnly = props.editonly;
			}
			else if ( !state.editing && props.viewonly ) {
				ShowOnly = props.viewonly;
			}
//			else if ( state.editing && props.authors ) {
//				ShowOnly = <ContentCommonBody>
//					Hey sorry for the delay! Publishing your game is coming soon!<br />
//					<br />
//					If you're finished and you wont be able to submit before the compo deadline, don't worry! Do what you can above. We will make sure that you get your game in the compo.<br />
//					<br />
//					If you're new to Ludum Dare, you should know we don't host your downloads, just links to them. For recommendations where and how to host your files, check out the Hosting Guide:<br />
//					<br />
//					<NavLink blank href="/events/ludum-dare/hosting-guide">/ludum-dare/hosting-guide</NavLink><br />
//					<br />
//					</ContentCommonBody>;
//			}

			let ShowTitle = null;
			if ( !props.notitle ) {
				ShowTitle = <ContentCommonBodyTitle
					href={node.path}
					title={state.name}
					hover={node.slug+' [$'+node.id+']'}
					subtitle={props.subtitle}
					titleIcon={props.titleIcon}
					editing={props.notitleedit ? false : state.editing}
					onmodify={this.onModifyTitle}
					limit="80"
				/>;
			}

			let ShowMarkup = null;
			if ( !props.nomarkup ) {
				ShowMarkup = (
					<ContentCommonBodyMarkup
						node={node}
						user={user}
						label={props.label ? props.label : "Description"}
						editing={state.editing}
						placeholder="Say something"
						class="-block-if-not-minimized"
						onmodify={this.onModifyText}
						minimized={props.minimized}
						limit={props.limit}
					>
						{state.body}
					</ContentCommonBodyMarkup>
				);
			}

			let ShowAbove = null;
			if ( props.above ) {
				ShowAbove = props.above;
			}

			let ShowDraft = null;
			if ( !node.published ) {
				ShowDraft = <ContentCommonDraft draft={props.draft} />;
			}

			props.class = cN('content-simple', props.class);
			if ( this.isEditMode() ) {
				props.minmax = null;
				props.minimized = null;
			}

			return (
				<ContentCommon {...props}>
					{ShowEditBar}
					{ShowDraft}
					{ShowAvatar}
					{ShowTitle}
					{ShowAbove}
					{ShowByLine}
					{ShowMarkup}
					{ShowOnly}
					{props.children}
				</ContentCommon>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
