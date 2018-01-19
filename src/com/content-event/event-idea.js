import {h, Component} 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';
import SVGIcon 							from 'com/svg-icon/icon';
import UIButton							from 'com/ui/button/button';
import $ThemeIdea						from '../../shrub/js/theme/theme_idea';


const MAX_IDEAS = 3;
const canHaveMoreIdeas = (ideas, submitting) => Object.keys(ideas).length + (submitting ? 1 : 0) < MAX_IDEAS;
const hasSubmittedIdeas = (ideas) => Object.keys(ideas).length > 0;

export default class ContentEventIdea extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'idea': '',
			'ideas': null,
			'enableSubmit': false,
		};

		this.onKeyDown = this.onKeyDown.bind(this);
		this.textChange = this.textChange.bind(this);
		this.submitIdeaForm = this.submitIdeaForm.bind(this);

		this.renderIdea = this.renderIdea.bind(this);
	}

	componentDidMount() {
		$ThemeIdea.GetMy([this.props.node.id])
		.then(r => {
			//console.log(r);
			if ( r.ideas ) {
				this.setState({'ideas': r.ideas, 'enableSubmit': canHaveMoreIdeas(r.ideas)});
			}
			else {
				this.setState({'ideas': {}});
			}
		})
		.catch(err => {
			this.setState({'error': 'Error fetching your previous suggestions. Make sure you are logged in.'});
		});
	}

	textChange( e, isSubmit ) {
		let idea = e.target.value;
		if (isSubmit) {
			idea = idea.trim();
		}
		this.setState({'idea': idea, 'error': idea.length > 64 ? 'Suggestion is too long.' : null});
	}

	onKeyDown( e ) {
		if (!e) {
			e = window.event;
		}
		const isSubmit = e.keyCode === 13;
		this.textChange(e, isSubmit);
		if (isSubmit) {
			/*e.preventDefault();*/
			this.submitIdeaForm();
		}
	}

	removeIdea( id, e ) {
		id = parseInt(id);

		//console.log('remove:', id );
		this.setState({'error': null});
		if ( id ) {
			$ThemeIdea.Remove(this.props.node.id, id)
			.then(r => {
				//console.log(r.ideas);
				this.setState({'ideas': r.ideas, 'enableSubmit': canHaveMoreIdeas(r.ideas)});
			})
			.catch(err => {
				this.setState({'error': 'Error processing the request. Make sure you are still logged in.'});
			});
		}
		else {
			this.setState({'error': 'Unexpected error.'});
		}
	}

	checkDuplicateIdea(idea) {
		const {processingIdea, ideas} = this.state;
		if (processingIdea && idea == processingIdea) {
			return true;
		}
		else {
			return Object.values(ideas).indexOf(idea) > -1;
		}
	}

	submitIdeaForm( e ) {
		let idea = this.state.idea.trim();
		//console.log('submit:', idea);
		if (this.checkDuplicateIdea(idea)) {
			this.setState({
				'error': 'Duplicated suggestion! There\'s no point in supplying the same suggestion more than once.'
			});
		}
		else if ( idea.length > 0 && idea.length <= 64 ) {
			this.setState({'enableSubmit': canHaveMoreIdeas(this.state.ideas, true), 'processingIdea': idea, 'error': null});
			$ThemeIdea.Add(this.props.node.id, idea)
			.then(r => {
				//console.log('r', r);
				this.setState({'ideas': r.ideas, 'idea': r.status === 201 ? '' : idea, 'enableSubmit': canHaveMoreIdeas(r.ideas), 'processingIdea': null});
			})
			.catch(err => {
				this.setState({'error': 'Error processing the request. Make sure you are still logged in.', 'processingIdea': null});
			});
		}
		else {
			this.setState({'error': 'Suggestion is too ' + (idea.length == 0 ? 'short.' : 'long.')});
		}
	}

	renderIdea( id ) {
		const idea = this.state.ideas[id];

		return (
			<div class="-item">
				<div class="-x" onclick={this.removeIdea.bind(this, id)}><SVGIcon>cross</SVGIcon></div>
				<SVGIcon>ticket</SVGIcon>
				<div class="-text" title={idea}>{idea}</div>
			</div>
		);
	}
	renderIdeas() {
		return Object.keys(this.state.ideas).map(this.renderIdea);
	}

	render( {node, user/*, path, extra*/}, {idea, ideas, error, enableSubmit} ) {
		if ( node.slug && ideas ) {
			if ( user && user['id'] ) {
				const ShowError = error ? <div class="content-base content-post idea-error">{error}</div> : null;
				let ShowSubmit = null;
				if (enableSubmit) {
					ShowSubmit = (
						<div class="idea-form">
							<input type="text"
								class="-suggestion"
								onchange={this.textChange} onkeydown={this.onKeyDown}
								placeholder="Your suggestion" maxlength="64" value={idea} />
							<UIButton onclick={this.submitIdeaForm}>
								<SVGIcon>suggestion</SVGIcon> Submit
							</UIButton>
						</div>
					);
				}
				let ShowMySuggestions = null;
				if (hasSubmittedIdeas(ideas)) {
					ShowMySuggestions = (
						<div class="idea-mylist">
							{ this.renderIdeas() }
						</div>
					);
				}
				let ShowRemaining = null;
				const remaining = Math.max(0, MAX_IDEAS - Object.keys(ideas).length);
				if (remaining > 1) {
					ShowRemaining = <div class="foot-note small">You have <strong>{remaining}</strong> suggestions left</div>;
				}
				else if (remaining == 1) {
					ShowRemaining = <div class="foot-note small">You have <strong>1</strong> suggestion left</div>;
				}
				else {
					ShowRemaining = <div class="foot-note small">You have no suggestions left</div>;
				}
				return (
					<div class="idea-body">
						<h3>Theme Suggestion Round</h3>
						<h4>Your Suggestions</h4>
						{ShowMySuggestions}
						{ShowSubmit}
						{ShowError}
						{ShowRemaining}
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
