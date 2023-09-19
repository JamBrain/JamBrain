import {Component} from 'preact';
import './event-idea.less';

import {Icon, Button} from 'com/ui';
import {ContentSimple} from 'com/content/simple';

import $Node							from 'backend/js/node/node';
import $ThemeIdea						from 'backend/js/theme/theme_idea';
import Sanitize							from 'internal/sanitize';

const SHOW_PREVIOUS = 6;

const canHaveMoreIdeas = (ideas, submitting, max) => ((Object.keys(ideas).length + (submitting ? 1 : 0)) < max);
const hasSubmittedIdeas = (ideas) => (Object.keys(ideas).length > 0);

export default class ContentEventIdea extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'idea': "",
			'ideas': null,
			'previousThemes': [],
			'enableSubmit': false,
			'maxIdeas': ((props.node.meta && props.node.meta['theme-idea-limit']) ? props.node.meta['theme-idea-limit'] : 0),
			'processingIdea': null,
		};

		this.onKeyDown = this.onKeyDown.bind(this);
		this.textChange = this.textChange.bind(this);
		this.submitIdeaForm = this.submitIdeaForm.bind(this);
		this.renderIdea = this.renderIdea.bind(this);
	}

	componentDidMount() {
		this.getPreviousEventThemes();

		$ThemeIdea.GetMy([this.props.node.id])
		.then(r => {
			//console.log(r);
			if ( r.ideas ) {
				this.setState(prevState => ({'ideas': r.ideas, 'enableSubmit': canHaveMoreIdeas(r.ideas, false, prevState.maxIdeas)}));
			}
			else {
				this.setState({'ideas': {}});
			}
		})
		.catch(err => {
			this.setState({'error': "Error fetching your previous suggestions. Make sure you are logged in."});
		});
	}

	getPreviousEventThemes() {
		//TODO: Handle more than 50 events with offsets
		$Node.GetFeed(this.props.node.parent, 'parent', 'event', null, null, null, null, 50)
			.then((r) => {
				const events = r.feed;//.map((e) => (e.id));
				$Node.Get(events).then((r2) => {
					const eventThemes = r2.node
						.sort((a,b) => (new Date(b.meta['event-start']).valueOf() - new Date(a.meta['event-start']).valueOf()))
						.filter((n) => n.id !== this.props.node.id)
						.map((n) => {
							return {'id': n.id, 'start': n.meta['event-start'], 'theme': n.meta['event-theme'], 'name': n.name};
						});
					this.setState({'previousThemes': eventThemes});
				})
				.catch((err) => (this.setState({'error': "Could not retrieve previous events."})));
			})
			.catch((err) => (this.setState({'error': "Could not find list of previous events."})));
	}

	textChange( e, isSubmit ) {
		let idea = e.target.value;
		if ( isSubmit ) {
			idea = idea.trim();
		}
		this.setState({'idea': idea, 'error': ((idea.length > 64) ? "Suggestion is too long." : null)});
	}

	onKeyDown( e ) {
		if ( !e ) {
			e = window.event;
		}
		const isSubmit = (e.keyCode === 13);
		this.textChange(e, isSubmit);
		if ( isSubmit ) {
			/*e.preventDefault();*/
			this.submitIdeaForm();
		}
	}

	removeIdea( id, e ) {
		id = Number(id);

		//console.log('remove:', id );
		this.setState({'error': null});
		if ( id ) {
			$ThemeIdea.Remove(this.props.node.id, id)
			.then(r => {
				//console.log(r.ideas);
				this.setState(prevState => ({'ideas': r.ideas, 'enableSubmit': canHaveMoreIdeas(r.ideas, false, prevState.maxIdeas)}));
			})
			.catch(err => {
				this.setState({'error': "Error processing the request. Make sure you are still logged in."});
			});
		}
		else {
			this.setState({'error': "Unexpected error."});
		}
	}

	checkDuplicateIdea( idea ) {
		const {processingIdea, ideas} = this.state;
		idea = Sanitize.slugify_Name(idea);

		if ( processingIdea && (idea == Sanitize.slugify_Name(processingIdea)) ) {
			return true;
		}
		else {
			for ( var idx in ideas ) {
				if ( idea == Sanitize.slugify_Name(ideas[idx]) )
					return true;
			}
		}
		return false;
	}

	submitIdeaForm( e ) {
		let idea = this.state.idea.trim();
		//console.log('submit:', idea);
		if ( this.checkDuplicateIdea(idea) ) {
			this.setState({
				'error': "Suggestion is too similar to one of your other suggestions."
			});
		}
		else if ( (idea.length > 0) && (idea.length <= 64) ) {
			this.setState(prevState => ({
				'enableSubmit': canHaveMoreIdeas(prevState.ideas, true, prevState.maxIdeas),
				'processingIdea': idea,
				'error': null,
			}));
			$ThemeIdea.Add(this.props.node.id, idea)
			.then(r => {
				//console.log('r', r);
				this.setState(prevState => ({
					'ideas': r.ideas,
					'idea': (r.status === 201) ? '' : idea,
					'enableSubmit': canHaveMoreIdeas(r.ideas, false, prevState.maxIdeas),
					'processingIdea': null,
				}));
			})
			.catch(err => {
				this.setState({'error': "Error processing the request. Make sure you are still logged in.", 'processingIdea': null});
			});
		}
		else {
			this.setState({'error': "Suggestion is too " + (idea.length == 0 ? "short." : "long.")});
		}
	}

	renderIdea( id ) {
		const idea = this.state.ideas[id];

		return (
			<div class="-item">
				<Icon src="lightbulb" />
				<div class="-text">{idea}</div>
				<div class="-x" onClick={this.removeIdea.bind(this, id)}>
					<Icon src="cross" />
				</div>
			</div>
		);
	}

	renderIdeas() {
		return Object.keys(this.state.ideas).map(this.renderIdea);
	}

	render( props, state ) {
		const {node, user} = props;
		const {idea, ideas, error, enableSubmit, maxIdeas, previousThemes} = state;

		const title = "Theme Suggestion Round";
		const titleClass = `-event -ideas ${props.class ?? ''}`;

		// While node or ideas haven't finished loading
		if ( !node || !node.id || !ideas ) {
			return null;
		}

		if ( !user || !user.id ) {
			// TODO: insert a login button
			return <ContentSimple title={title} class={titleClass}><p>Please log in</p></ContentSimple>;
		}


		if ( !maxIdeas ) {
			return <ContentSimple title={title} class={titleClass}><p>This event doesn't allow suggesting themes</p></ContentSimple>;
		}

		let ShowPrevious = null;
		if ( previousThemes && previousThemes.length > 0 ) {
			const ShowThemeList = previousThemes.slice(0, SHOW_PREVIOUS).map((prevEvent) => {
				let Theme = null;
				if ( prevEvent.theme ) {
					Theme = <div class="event-theme">{prevEvent.theme}</div>;
				}
				else {
					Theme = <div class="event-no-theme">Event did not have a theme</div>;
				}
				return (
					<p class="previous-theme previous-theme-item" key={prevEvent.id}>
						<div class="event-name">{prevEvent.name}</div>
						{Theme}
					</p>
				);
			});
			ShowPrevious = (
				<div class="previous-theme">
					<h4>Previous Themes</h4>
					{ShowThemeList}
				</div>
			);
		}
		const ShowError = error ? <div class="content content-post idea-error">{error}</div> : null;
		let ShowSubmit = null;
		if ( enableSubmit ) {
			ShowSubmit = (
				<p class="idea-form">
					<input type="text"
						class="-suggestion"
						onChange={this.textChange} onKeyDown={this.onKeyDown}
						placeholder="Your suggestion" maxLength={64} value={idea}
						/>
					<Button onClick={this.submitIdeaForm}><Icon src="suggestion" /> Submit</Button>
				</p>
			);
		}

		let ShowMySuggestions = null;
		if ( hasSubmittedIdeas(ideas) ) {
			ShowMySuggestions = <p class="idea-mylist">{this.renderIdeas()}</p>;
		}

		let ShowRemaining = null;
		const remaining = Math.max(0, maxIdeas - Object.keys(ideas).length);
		if ( remaining > 1 ) {
			ShowRemaining = <p class="foot-note small">You have <strong>{remaining}</strong> suggestions left</p>;
		}
		else if ( remaining == 1 ) {
			ShowRemaining = <p class="foot-note small">You have <strong>1</strong> suggestion left</p>;
		}
		else {
			ShowRemaining = <p class="foot-note small">You have no suggestions left</p>;
		}

		// Render
		return (
			<ContentSimple title={title} class={titleClass}>
				{ShowPrevious}
				<h2>Your Suggestions</h2>
				{ShowMySuggestions}
				{ShowSubmit}
				{ShowError}
				{ShowRemaining}
			</ContentSimple>
		);

		/*
		else {
			return (
				<div class="content content-post">
					{error ? error : <NavSpinner />}
				</div>
			);
		}
		*/
	}
}
