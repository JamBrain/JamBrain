import {h, Component}					from 'preact/preact';
import ContentCommonBody				from 'com/content-common/common-body';
import ButtonBase						from 'com/button-base/base';
import NavLink							from 'com/nav-link/link';
import UIIcon							from 'com/ui/icon/icon';

export default class ContentItemRulesCheck extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const {onAllowChange, answers} = this.props;
		const mountState = Object.assign({}, this.state, answers);
		if (onAllowChange) onAllowChange({
			'allowJam': this.allowJam(mountState),
			'allowCompo': this.allowCompo(mountState),
			'allowUnfinished': this.allowUnfinished(mountState),
			'rulesAnswers': mountState,
		});
	}

	handleChange(field, nextValue) {
		const {onAllowChange} = this.props;
		const nextState = Object.assign(
			{},
			this.state,
			this.props.answers,
			{[field]: nextValue}
		);
		if (onAllowChange) onAllowChange({
			'allowJam': this.allowJam(nextState),
			'allowCompo': this.allowCompo(nextState),
			'allowUnfinished': this.allowUnfinished(nextState),
			'rulesAnswers': nextState,
		});
		this.setState({[field]: nextValue});
	}

	allowJam(nextState) {
		if (!this.allowByCommonRules(nextState)) return false;
		if (!nextState.willVote) return false;
		if (!nextState.optedOut) return false;
		return true;
	}

	allowCompo(nextState) {
		if (!this.allowByCommonRules(nextState)) return false;
		if (!nextState.willVote) return false;
		if (!nextState.optedOut) return false;
		if (!nextState.workedSolo) return false;
		if (!nextState.createdAll) return false;
		if (!nextState.createdWithin48) return false;
		if (!nextState.includedSource) return false;

		return true;
	}

	allowUnfinished(nextState) {
		if (!this.allowByCommonRules(nextState)) return false;
		return true;
	}

	allowByCommonRules(nextState) {
		if (!nextState.readRules) return false;
		return true;
	}

	render(props, state) {
		const MandatoryCompo = <span class="-mandatory">(<span>COMPO ONLY</span>)</span>;
		const IconUnChecked = <UIIcon small baseline class="-checkbox" src="checkbox-unchecked" />;
		const IconChecked = <UIIcon small baseline class="-checkbox" src="checkbox-checked" />;

		const {
			readRules, workedSolo, createdAll, createdWithin48,
			includedSource, willVote, optedOut,
		} = (props.answers ? props.answers : state);

		return (
			<ContentCommonBody class="-rules-check -body">
				<div class="-label">Submission Checklist</div>
				<div class="-items">
					<ButtonBase onclick={this.handleChange.bind(this, 'readRules', !readRules)}>
						{readRules ? IconChecked : IconUnChecked}
						I have read and understood <NavLink blank href="/events/ludum-dare/rules/"><strong>the rules</strong></NavLink>.
					</ButtonBase>

					<ButtonBase onclick={this.handleChange.bind(this, 'optedOut', !optedOut)}>
						{optedOut ? IconChecked : IconUnChecked}
						I have opted-out of any categories we are not eligible for (see opt-outs above).
					</ButtonBase>
					<ButtonBase onclick={this.handleChange.bind(this, 'willVote', !willVote)}>
						{willVote ? IconChecked : IconUnChecked}
						I understand that if we want a score at the end, we need to play and rate other participants games.
					</ButtonBase>
				</div>

				{(node_CountAuthors(props.node) <= 1) && (
					<div class="-items">
						<ButtonBase onclick={this.handleChange.bind(this, 'workedSolo', !workedSolo)}>
							{workedSolo ? IconChecked : IconUnChecked}
							I worked alone.
							{MandatoryCompo}
						</ButtonBase>
						<ButtonBase onclick={this.handleChange.bind(this, 'createdAll', !createdAll)}>
							{createdAll ? IconChecked : IconUnChecked}
							I created all the code, art, sound, music, and other assets myself during the event.
							{MandatoryCompo}
						</ButtonBase>
						<ButtonBase onclick={this.handleChange.bind(this, 'createdWithin48', !createdWithin48)}>
							{createdWithin48 ? IconChecked : IconUnChecked}
							I created everything in 48 hours.
							{MandatoryCompo}
						</ButtonBase>
						<ButtonBase onclick={this.handleChange.bind(this, 'includedSource', !includedSource)}>
							{includedSource ? IconChecked : IconUnChecked}
							I have included source code.
							{MandatoryCompo}
						</ButtonBase>
					</div>
				)}
				<div class="-footer">
					<UIIcon baseline src="warning" class="-warning" />
					<span> Before you can select an Event and Publish, you must agree to <em>some</em> of the questions above.</span>
				</div>
			</ContentCommonBody>
		);
	}
}
