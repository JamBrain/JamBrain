import {h, Component}		from 'preact/preact';

import NavLink				from 'com/nav-link/link';
import SVGIcon				from 'com/svg-icon/icon';

export default class LocalLink extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {

		return (
			<span class="smart-link local-link">
				<NavLink href={props.href} title={props.title} target={props.target}>
					<span class="-icon-domain">
						<SVGIcon baseline small name={'l-udum'}/>
						<SVGIcon baseline small name={'d-are'}/>
					</span>
					<span class="-the-rest">
						{props.text}
					</span>
				</NavLink>
			</span>
		);
	}
}
