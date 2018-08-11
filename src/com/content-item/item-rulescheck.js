import {h, Component} from 'preact/preact';
import ContentCommonBody from 'com/content-common/common-body';
import ButtonBase from 'com/button-base/base';
import NavLink from 'com/nav-link/link';
import SVGIcon from 'com/svg-icon/icon';

export default class ContentItemRulesCheck extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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
			allowJam: this.allowJam(nextState),
			allowCompo: this.allowCompo(nextState),
			allowUnfinished: this.allowUnfinished(nextState),
			rulesAnswers: nextState,
		});
		this.setState({[field]: nextValue});
	}

	allowJam(nextState) {
		if (!this.allowByCommonRules(nextState)) return false;
		if (!nextState.createdWithin72 && !nextState.createdWithin48) return false;
		if (!nextState.optedOut) return false;
		return true;
	}

	allowCompo(nextState) {
		if (!this.allowByCommonRules(nextState)) return false;
		if (!nextState.workedSolo) return false;
		if (!nextState.createdAll) return false;
		if (!nextState.createdWithin48) return false;
		if (!nextState.includedSource) return false;

		// This indicates you misunderstood the rules.
		// but as it is now it would be too confusing to activate
		//if (nextState.optedOut) return false;

		return true;
	}

	allowUnfinished(nextState) {
		if (!this.allowByCommonRules(nextState)) return false;
		return true;
	}

	allowByCommonRules(nextState) {
		if (!nextState.readRules) return false;
		if (!nextState.willVote) return false;
		return true;
	}

	componentDidMount() {
		const { onAllowChange, answers } = this.props;
		const mountState = Object.assign({}, this.state, answers);
		if (onAllowChange) onAllowChange({
			allowJam: this.allowJam(mountState),
			allowCompo: this.allowCompo(mountState),
			allowUnfinished: this.allowUnfinished(mountState),
			rulesAnswers: mountState,
		});
	}

	render(props, state) {
		const Mandatory = <span class="-mandatory">ALL</span>;
		const MandatoryCompo = <span class="-mandatory">COMPO</span>;
		const MandatoryJam = <span class="-mandatory">JAM</span>;
		const IconUnChecked = <SVGIcon small baseline class="-checkbox">checkbox-unchecked</SVGIcon>;
		const IconChecked = <SVGIcon small baseline class="-checkbox">checkbox-checked</SVGIcon>;
		const {
			readRules, workedSolo, createdAll, createdWithin48, createdWithin72,
			includedSource, willVote, optedOut,
		} = (props.answers ? props.answers : state);

		return (
			<ContentCommonBody class="-rules-check">
				<div class="-label">Rules Checklist</div>
				<div class="-info">Before you can publish, you need to agree to some of the questions below.</div>
				<div class="-items">
					<ButtonBase onclick={this.handleChange.bind(this, 'readRules', !readRules)}>
						{readRules ? IconChecked : IconUnChecked}
						{Mandatory}
						I have read and understood <NavLink blank href="/events/ludum-dare/rules"><strong>the rules</strong></NavLink>.
					</ButtonBase>
					<ButtonBase onclick={this.handleChange.bind(this, 'workedSolo', !workedSolo)}>
						{workedSolo ? IconChecked : IconUnChecked}
						{MandatoryCompo}
						I worked <strong>alone</strong> on the game.
					</ButtonBase>
					<ButtonBase onclick={this.handleChange.bind(this, 'createdAll', !createdAll)}>
						{createdAll ? IconChecked : IconUnChecked}
						{MandatoryCompo}
						I created all the code, art, music and sounds myself during the LD.
					</ButtonBase>
					<ButtonBase onclick={this.handleChange.bind(this, 'createdWithin48', !createdWithin48)}>
						{createdWithin48 ? IconChecked : IconUnChecked}
						{MandatoryCompo}
						I created everything during the 48h of the LD.
					</ButtonBase>
					<ButtonBase onclick={this.handleChange.bind(this, 'includedSource', !includedSource)}>
						{includedSource ? IconChecked : IconUnChecked}
						{MandatoryCompo}
						I included the source code.
					</ButtonBase>
					<ButtonBase onclick={this.handleChange.bind(this, 'createdWithin72', !createdWithin72)}>
						{createdWithin72 ? IconChecked : IconUnChecked}
						{MandatoryJam}
						I/We created all conents I/we want to be rated for during the 72h of LD.
					</ButtonBase>
					<ButtonBase onclick={this.handleChange.bind(this, 'optedOut', !optedOut)}>
						{optedOut ? IconChecked : IconUnChecked}
						{MandatoryJam}
						I/We opt out of all voting categories for which we did not do everything ourselves.
					</ButtonBase>
					<ButtonBase onclick={this.handleChange.bind(this, 'willVote', !willVote)}>
						{willVote ? IconChecked : IconUnChecked}
						{Mandatory}
						I/We will participate in playing and voting on other games.
					</ButtonBase>
				</div>
				<div class="-footer">
					The different submission options and ultimately the ability to publish the game
					will become available depending on your answers.
					<div><strong>NOTE:</strong> Options marked with {Mandatory} is mandatory for all.</div>
					<div><strong>NOTE:</strong> Options marked with {MandatoryCompo} is mandatory for compo submissions.</div>
					<div><strong>NOTE:</strong> Options marked with {MandatoryJam} is mandatory for jam submissions.</div>
				</div>
			</ContentCommonBody>
		);
	}
}
