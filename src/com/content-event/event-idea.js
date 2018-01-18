import {h, Component} 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';
import SVGIcon 							from 'com/svg-icon/icon';

import $ThemeIdea						from '../../shrub/js/theme/theme_idea';


const MAX_IDEAS = 3;
const canHaveMoreIdeas = (ideas) => Object.keys(ideas).length < MAX_IDEAS;
const hasSubmittedIdeas = (ideas) => Object.keys(ideas).length > 0;

export default class ContentEventIdea extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'idea': '',
			'ideas': null,
			'disableSubmit': true,
		};

		this.onKeyDown = this.onKeyDown.bind(this);
		this.textChange = this.textChange.bind(this);
//		this.removeIdea = this.removeIdea.bind(this);
		this.submitIdeaForm = this.submitIdeaForm.bind(this);

		this.renderIdea = this.renderIdea.bind(this);
	}

	componentDidMount() {
		$ThemeIdea.GetMy([this.props.node.id])
		.then(r => {
			console.log(r);
			if ( r.ideas ) {
				this.setState({'ideas': r.ideas, 'disableSubmit': !canHaveMoreIdeas(r.ideas)});
			}
			else {
				this.setState({'ideas': {}, 'disableSubmit': false});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	textChange( e ) {
		this.setState({'idea': e.target.value.trim()});
	}

	onKeyDown( e ) {
		if (!e) {
			e = window.event;
		}
		if (e.keyCode === 13) {
			this.textChange(e);
			/*e.preventDefault();*/
			this.submitIdeaForm();
		}
	}

	removeIdea( id, e ) {
		id = parseInt(id);

		console.log('remove:', id );

		if ( id ) {
			$ThemeIdea.Remove(this.props.node.id, id)
			.then(r => {
				//console.log(r.ideas);
				this.setState({'ideas': r.ideas, 'disableSubmit': !canHaveMoreIdeas(r.ideas)});
			})
			.catch(err => {
				this.setState({'error': err});
			});
		}
		else {
			this.setState({'error': 'Problem with length'});
		}
	}

	submitIdeaForm( e ) {
		this.setState({'disableSubmit': true});
		let idea = this.state.idea.trim();
		console.log('submit:', idea);

		if ( idea.length > 0 && idea.length <= 64 ) {
			$ThemeIdea.Add(this.props.node.id, idea)
			.then(r => {
				console.log('r', r);
				this.setState({'ideas': r.ideas, 'idea': r.status === 201 ? '' : idea, 'disableSubmit': !canHaveMoreIdeas(r.ideas)});
			})
			.catch(err => {
				this.setState({'error': err, 'disableSubmit': false});
			});
		}
		else {
			this.setState({'error': 'Problem with length'});
		}
	}

	renderIdea( id ) {
		const idea = this.state.ideas[id];

		return (
			<div class="-item">
				<div class="-x" onclick={this.removeIdea.bind(this, id)}><SVGIcon>cross</SVGIcon></div>
				<div class="-text" title={idea}>{idea}</div>
			</div>
		);
	}
	renderIdeas() {
		return Object.keys(this.state.ideas).map(this.renderIdea);
	}

	render( {node, user/*, path, extra*/}, {idea, ideas, error, disableSubmit} ) {
		if ( node.slug && ideas ) {
			if ( user && user['id'] ) {
				let ShowSubmit = null;
				if (!disableSubmit) {
					ShowSubmit = (
						<div class="idea-form">
							<input type="text"
								class="-single"
								onchange={this.textChange} onkeydown={this.onKeyDown}
								placeholder="Your suggestion" maxlength="64" value={idea} />
							<button class="-submit" onclick={this.submitIdeaForm}>
								<SVGIcon>suggestion</SVGIcon> Submit
							</button>
						</div>
					);
				}
				let ShowMySuggestions = null;
				if (hasSubmittedIdeas(ideas)) {
					ShowMySuggestions = (
						<div>
							<h3>My Suggestions</h3>
							<div class="idea-mylist">
								{ this.renderIdeas() }
							</div>
						</div>
					);
				}
				return (
					<div class="-body">
						<h3>Theme Suggestion Round</h3>
						{ShowMySuggestions}
						{ShowSubmit}
						<div class="foot-note small">You have <strong>{Math.max(0, MAX_IDEAS - Object.keys(ideas).length)}</strong> suggestion(s) left</div>
					</div>
				);
			}
			else {
				return (
					<div class="-body">
						<h3>Theme Suggestion Round</h3>
						<div>Please log in</div>
					</div>
				);
			}
		}
		else {
			return (
				<div class="content-base content-post">
					{ error ? error : <NavSpinner /> }
				</div>
			);
		}
	}
}
