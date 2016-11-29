import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ButtonBase						from 'com/button-base/base';

import $ThemeIdea						from '../../shrub/js/theme/theme_idea';


export default class ContentEventSlaughter extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			idea: "",
			ideas: null
		};
		
		this.onKeyDown = this.onKeyDown.bind(this);
		this.textChange = this.textChange.bind(this);
		this.submitIdeaForm = this.submitIdeaForm.bind(this);
		
		this.renderIdea = this.renderIdea.bind(this);
	}
	
	componentDidMount() {
		$ThemeIdea.GetMy([this.props.node.id])
		.then(r => {
			if ( r.ideas ) {
				this.setState({ ideas: r.ideas });
			}
			else {
				this.setState({ ideas: {} });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}

//		<script>
//			document.getElementById("input-idea").addEventListener("keydown", function(e) {
//				if (!e) { var e = window.event; }
//				if (e.keyCode == 13) { /*e.preventDefault();*/ submitIdeaForm(); }
//			}, false);
//		</script>

	textChange( e ) {
		this.setState({ idea: e.target.value.trim() });
	}
	
	onKeyDown( e ) {
		if (!e) { 
			var e = window.event; 
		}
		if (e.keyCode === 13) { 
			this.textChange(e);
			/*e.preventDefault();*/ 
			this.submitIdeaForm(); 
		}
	}
	
	submitIdeaForm( e ) {
		var idea = this.state.idea.trim()
		console.log('submit:', idea);
		
		if ( idea.length > 0 && idea.length <= 64 ) {
			$ThemeIdea.Add(this.props.node.id, idea)
			.then(r => {
				console.log('r',r);
				this.setState({ ideas: r.ideas, idea: r.status === 201 ? "" : idea });
			})
			.catch(err => {
				this.setState({ error: err });
			});
		}
		else {
			this.setState({ error: "Problem with length" });
		}
	}

	renderIdea( id ) {
		var idea = this.state.ideas[id];
		
		return (
			<div class="-item">
				<div class='-text' title={idea}>{idea}</div>
			</div>
		);
	}
	renderIdeas() {
		return Object.keys(this.state.ideas).map(this.renderIdea);
	}

	render( {node, user, path, extra}, {idea, ideas, error} ) {
		var Title = <h3>Theme Slaughter Round</h3>;
		
		if ( node.slug && ideas ) {
			if ( user && user['id'] ) {
				return (
					<div class="-body">
						{Title}
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
						{Title}
						<div>Please log in</div>
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
