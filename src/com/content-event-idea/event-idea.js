import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

const MAX_IDEAS = 3;

export default class ContentEventIdea extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			ideas: [ "contra" ]
		};
		
		this.removeIdea = this.removeIdea.bind(this);
		this.submitIdeaForm = this.submitIdeaForm.bind(this);
	}

//		<script>
//			document.getElementById("input-idea").addEventListener("keydown", function(e) {
//				if (!e) { var e = window.event; }
//				if (e.keyCode == 13) { /*e.preventDefault();*/ SubmitIdeaForm(); }
//			}, false);
//		</script>

	removeIdea( idea ) {
		console.log('remove');
	}
	
	submitIdeaForm( form ) {
		console.log('submit');
	}

	renderIdea( idea ) {
		return (
			<div class="-item">
				<div class='-x' onclick={this.removeIdea}>✕</div>
				<div class='-text' title={idea}>{idea}</div>
			</div>
		);
	}

	render( {node, user, path, extra}, {ideas, error} ) {
		if ( node.slug ) {
			if ( user && user['id'] ) {
				return (
					<div class="-body">
						<h3>Theme Suggestion Round</h3>
						<div class="idea-form">
							<input type="text" class="-single" id="input-idea" placeholder="Your suggestion" maxlength="64" />
							<button type="button" class="-submit" onclick={this.SubmitIdeaForm}>Submit</button>
						</div>
						<div class="foot-note small">You have <strong>{MAX_IDEAS-ideas.length}</strong> suggestion(s) left</div>
						<h3>My Suggestions</h3>
						<div class="idea-mylist">
							{ ideas.map(this.renderIdea) }
						</div>
					</div>
				);
			}
			else {
				return (
					<div class="-body">
						<h3>Theme Suggestion Round</h3>
						<div>Please log in to make suggestion</div>
					</div>
				);
			}
		}
		else {
			return (
				<div class="content-base content-post">
					{ error ? error : "Please Wait..." }
				</div>
			);
		}
	}
}