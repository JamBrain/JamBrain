import { Component } from 'preact';
import './item-rulescheck.less';

import { node_CanPublish, node_CountAuthors, node_IsPublished } from 'internal/lib';
import ContentCommonBody				from 'com/content-common/common-body';
import ButtonBase						from 'com/button-base/base';
import {Icon, Link} from 'com/ui';

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
			'allowExtra': this.allowExtra(mountState),
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
			'allowExtra': this.allowExtra(nextState),
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

	allowExtra(nextState) {
		if (!this.allowByCommonRules(nextState)) return false;
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
		if (node_IsPublished(this.props.node) && !nextState.changeFormat) return false;
		if (!nextState.readRules) return false;
		return true;
	}

	// TODO: Make and use a global/external function instead
	getFormatName() {
		const formatNames = {
			"jam": "Jam",
			"compo": "Compo",
			"extra": "Extra",
			"unfinished": "Unfinished",
			"release": "Release"
		};

		return (this.props.node.subsubtype && formatNames[this.props.node.subsubtype]) ? formatNames[this.props.node.subsubtype] : this.props.node.subsubtype;
	}

	render(props, state) {
		const MandatoryCompo = <span class="-mandatory">(<span>COMPO ONLY</span>)</span>;
		const IconUnChecked = <Icon small baseline class="-checkbox" src="checkbox-unchecked" />;
		const IconChecked = <Icon small baseline class="-checkbox" src="checkbox-checked" />;

		const {
			changeFormat, readRules, workedSolo, createdAll, createdWithin48,
			includedSource, willVote, optedOut,
		} = (props.answers ? props.answers : state);

		return (
			<ContentCommonBody class="-rules-check -body">
				<div class="-label">Submission Checklist</div>
				<div class="-items">
					{node_IsPublished(props.node) && (
					<ButtonBase onClick={this.handleChange.bind(this, 'changeFormat', !changeFormat)}>
						{changeFormat ? IconChecked : IconUnChecked}
						I wish to change my event format.
						{props.node.subsubtype ? "(currently: "+this.getFormatName()+")" : ""}
					</ButtonBase>
					)}

					<ButtonBase onclick={this.handleChange.bind(this, 'readRules', !readRules)}>
						{readRules ? IconChecked : IconUnChecked}
						I have read and understood <Link blank href="//ludumdare.com/rules/"><strong>the rules</strong></Link>.
					</ButtonBase>

					<ButtonBase onClick={this.handleChange.bind(this, 'optedOut', !optedOut)}>
						{optedOut ? IconChecked : IconUnChecked}
						I have opted-out of all or any categories we are not eligible for (see opt-outs above).
					</ButtonBase>

					{(node_CanPublish(props.parent, "item/game/jam") || node_CanPublish(props.parent, "item/game/compo")) && (
					<ButtonBase onClick={this.handleChange.bind(this, 'willVote', !willVote)}>
						{willVote ? IconChecked : IconUnChecked}
						I understand that if we want a score at the end, we need to play, rate, and give feedback on other games.
					</ButtonBase>
					)}

					{node_CanPublish(props.parent, "item/game/compo") && (node_CountAuthors(props.node) <= 1) && (
					<div class="-items">
						<ButtonBase onClick={this.handleChange.bind(this, 'workedSolo', !workedSolo)}>
							{workedSolo ? IconChecked : IconUnChecked}
							I worked alone.
							{MandatoryCompo}
						</ButtonBase>
						<ButtonBase onClick={this.handleChange.bind(this, 'createdAll', !createdAll)}>
							{createdAll ? IconChecked : IconUnChecked}
							I created all the code, art, sound, music, and other assets myself during the event.
							{MandatoryCompo}
						</ButtonBase>
						<ButtonBase onClick={this.handleChange.bind(this, 'createdWithin48', !createdWithin48)}>
							{createdWithin48 ? IconChecked : IconUnChecked}
							I created everything in 48 hours.
							{MandatoryCompo}
						</ButtonBase>
						<ButtonBase onClick={this.handleChange.bind(this, 'includedSource', !includedSource)}>
							{includedSource ? IconChecked : IconUnChecked}
							I have included source code.
							{MandatoryCompo}
						</ButtonBase>
					</div>
					)}
				</div>
				<div class="-footer">
					<p>
						<Icon baseline src="warning" class="-warning" />
						<span> <strong>IMPORTANT:</strong> Before you can select an Event Format and Publish, you must agree to <em>some</em> questions above.</span>
					</p>
					<p>
						<span>You can change your format at any time, but be aware: Once a format has closed, it can no longer be selected. Contact <Link href="https://ludumdare.com/support">support</Link> for assistance.</span>
					</p>
				</div>
			</ContentCommonBody>
		);
	}
}
