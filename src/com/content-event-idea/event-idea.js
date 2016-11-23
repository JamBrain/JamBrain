import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

export default class ContentEventIdea extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
		};
	}

//		<script>
//			document.getElementById("input-idea").addEventListener("keydown", function(e) {
//				if (!e) { var e = window.event; }
//				if (e.keyCode == 13) { /*e.preventDefault();*/ SubmitIdeaForm(); }
//			}, false);
//		</script>

	render( {node, user, path, extra}, {error} ) {
		if ( node.slug ) {
			if ( user && user['id'] ) {
				return (
					<div class="-body">
						<h3>Theme Suggestion Round</h3>
						<div class="idea-form">
							<input type="text" class="-single" id="input-idea" placeholder="Your suggestion" maxlength="64" />
							<button type="button" class="-submit" onclick={this.SubmitIdeaForm}>Submit</button>
						</div>
						<div class="foot-note small">You have <strong><span id="sg-count">?</span></strong> suggestion(s) left</div>
					</div>
				);
			}
			else {
				return (
					<div class="-body">
						<h3>Theme Suggestion Round</h3>
						<div>Please log in to make a suggestion</div>
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