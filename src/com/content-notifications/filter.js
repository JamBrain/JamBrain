import {h, Component}	 				from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';
import ButtonBase						from 'com/button-base/base';

export default class NotificationsFilter extends Component {

	constructor(props) {
		super(props);
		this.onToggleComments = this.onFilterChange.bind(this, 'comments');
		this.onToggleSelfComments = this.onFilterChange.bind(this, 'selfComment');
	}

	onFilterChange(filterKey) {
		this.props.handleFilterChange({filterKey: this.props.filters[filterKey] === undefined ? false: !this.props.filters[filterKey]});
	}

	render(props, state) {
		return (
			<div>
				<ButtonBase onclick={this.onToggleSelfComments}><SVGIcon>bubbles</SVGIcon><div>Comments on my stuff</div></ButtonBase>
				<ButtonBase onclick={this.onToggleComments}><SVGIcon>bubble</SVGIcon><div>Comments</div></ButtonBase>
			</div>
		);
	}
}
