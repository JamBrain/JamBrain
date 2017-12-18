import {h, Component}					from 'preact/preact';
import UIButtonLink from 'com/ui/button/button-link';

export default class GradedItem extends Component {
	render( props ) {
		const {node} = props;
		return (
			<UIButtonLink class={cN("event-graded-game", props.class)} href={node.path}>
				<strong>{node.name}</strong>
				<p>{node.body.substr(0, 100)}...</p>
			</UIButtonLink>
		);
	}
}
