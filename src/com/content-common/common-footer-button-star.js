import { Component } from 'preact';
import './common-footer-button.less';

import { UIIcon } from 'com/ui';

import $NodeStar						from 'backend/js/node/node_star';

export default class ContentCommonFooterButtonStar extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'starred': null,
		};

		this.onStar = this.onStar.bind(this);
	}

	componentDidMount() {
//		// TODO: Extract Love from the global love pool (props.node.id)
//
//		if ( this.props.user && this.props.user.id ) {
//			$NodeLove.GetMy(this.props.node.id)
//			.then(r => {
//				this.setState({ 'loved': r });
//			});
//		}
	}

	onStar( e ) {
//		if ( this.state.starred ) {
//			$NodeLove.Remove(this.props.node.id)
//			.then(r => {
//				this.setState({ 'loved': false, 'lovecount': r.love.count });
//			});
//		}
//		else {
//			$NodeLove.Add(this.props.node.id)
//			.then(r => {
//				this.setState({ 'loved': true, 'lovecount': r.love.count });
//			});
//		}
	}

	render( {node}, {starred} ) {
		var _class = "content-common-footer-button -star" + (starred ? " starred" : "");
		return (
			<div class={_class} onClick={this.onStar}>
				<UIIcon>star-full</UIIcon>
			</div>
		);
	}
}
