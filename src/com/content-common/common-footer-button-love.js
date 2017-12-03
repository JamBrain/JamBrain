import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

import $NodeLove						from '../../shrub/js/node/node_love';

export default class ContentCommonFooterButtonLove extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'loved': null,
			'lovecount': null
		};

		this.onLove = this.onLove.bind(this);
	}

	componentDidMount() {
		// TODO: Extract Love from the global love pool (props.node.id)

		if ( this.props.user && this.props.user.id ) {
			$NodeLove.GetMy(this.props.node.id)
			.then(r => {
				this.setState({ 'loved': r });
			});
		}
	}

	onLove( e ) {
		if ( this.state.loved ) {
			$NodeLove.Remove(this.props.node.id)
			.then(r => {
				this.setState({ 'loved': false, 'lovecount': r.love.count });
			});
		}
		else {
			$NodeLove.Add(this.props.node.id)
			.then(r => {
				this.setState({ 'loved': true, 'lovecount': r.love.count });
			});
		}
	}

	render( {node}, {loved, lovecount} ) {
		let Love = Number.isInteger(lovecount) ? lovecount : node.love;
		let LoveClass = '';
		if ( Love >= 10 )
			LoveClass = '-count-10';
		else if ( Love >= 4 )
			LoveClass = '-count-4';
		else if ( Love >= 1 )
			LoveClass = '-count-1';

		let Classes = cN("content-common-footer-button -love", (loved ? " loved" : ""), LoveClass );

		return (
			<div class={Classes} onclick={this.onLove}>
				<SVGIcon class="-hover-hide">heart</SVGIcon>
				<SVGIcon class="-hover-show -loved-hide">heart-plus</SVGIcon>
				<SVGIcon class="-hover-show -loved-show">heart-minus</SVGIcon>
				<div class="-count">{Love}</div>
			</div>
		);
	}
}
