import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ButtonBase						from 'com/button-base/base';

import $ThemeIdea						from '../../shrub/js/theme/theme_idea';


const MAX_IDEAS = 3;

export default class ContentEventIdea extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			idea: "",
			ideas: null
		};
		
		this.textChange = this.textChange.bind(this);
		this.removeIdea = this.removeIdea.bind(this);
		this.submitIdeaForm = this.submitIdeaForm.bind(this);
		
		this.renderIdea = this.renderIdea.bind(this);
	}
	
	componentDidMount() {
		$ThemeIdea.GetMy([this.props.node.id])
		.then(r => {
			console.log(r.ideas);
			this.setState({ ideas: r.ideas });
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}

//		<script>
//			document.getElementById("input-idea").addEventListener("keydown", function(e) {
//				if (!e) { var e = window.event; }
//				if (e.keyCode == 13) { /*e.preventDefault();*/ SubmitIdeaForm(); }
//			}, false);
//		</script>

	textChange( e ) {
		this.setState({ idea: e.target.value });
	}

	removeIdea( idea ) {
		console.log('remove');
	}
	
	submitIdeaForm( form ) {
		console.log('submit');
	}

	renderIdea( id ) {
		//console.log('erro',id,this.state.ideas);
		var idea = this.state.ideas[id];
		
		return (
			<div class="-item">
				<div class='-x' onclick={this.removeIdea}>✕</div>
				<div class='-text' title={idea}>{idea}</div>
			</div>
		);
	}
	renderIdeas() {
		return Object.keys(this.state.ideas).map(this.renderIdea);
	}

	render( {node, user, path, extra}, {idea, ideas, error} ) {
		if ( node.slug && ideas ) {
			if ( user && user['id'] ) {
				return (
					<div class="-body">
					<ButtonBase class="-submit" onclick={this.SubmitIdeaForm}>Voons</ButtonBase>
						<h3>Theme Suggestion Round</h3>
						<div class="idea-form">
							<input type="text" class="-single" onchange={this.textChange} placeholder="Your suggestion" maxlength="64" value={idea} />
							<button class="-submit" onclick={this.SubmitIdeaForm} >Submit</button>
						</div>
						<div class="foot-note small">You have <strong>{MAX_IDEAS-Object.keys(ideas).length}</strong> suggestion(s) left</div>
						<h3>My Suggestions</h3>
						<div class="idea-mylist">
							{ this.renderIdeas() }
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

//{ ideas && ideas.length && Object.values(ideas).map(this.renderIdea) }
