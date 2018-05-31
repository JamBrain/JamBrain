import {h, Component} 					from 'preact/preact';
import ContentCommonBody				from 'com/content-common/common-body';
import ButtonBase						from 'com/button-base/base';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

export default class ContentItemRulesCheck extends Component {
    constructor(props) {
        super(props);
    }

    handleChange(field, nextValue) {
        const {onAllowChange} = this.props;
        const nextState = Object.assign({}, this.state, {[field]: nextValue});
        if (onAllowChange) onAllowChange({
            allowJam: this.allowJam(nextState),
            allowCompo: this.allowCompo(nextState),
            allowUnfinished: this.allowUnfinished(nextState),
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
        if (nextstate.optedOut) return false; // This indicates you misunderstood the rules.
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
        const { onAllowChange } = this.props;
        if (onAllowChange) onAllowChange({
            allowJam: this.allowJam(this.state),
            allowCompo: this.allowCompo(this.state),
            allowUnfinished: this.allowUnfinished(this.state),
        });
    }

    render(props, state) {
        const Mandatory = <span class="-mandatory">*</span>;
        const MandatoryCompo = <span class="-mandatory">COMPO</span>;
        const MandatoryJam = <span class="-mandatory">JAM</span>;
        const IconUnChecked = <SVGIcon small baseline>checkbox-unchecked</SVGIcon>;
        const IconChecked = <SVGIcon small baseline>checkbox-checked</SVGIcon>;

        return (
            <ContentCommonBody class="-images">
                <div class="-label">Rules</div>
                <div>Please indicate what applies to you and your game.</div>
                <div><strong>NOTE:</strong> Options marked with {Mandatory} is mandatory for all.</div>
                <div><strong>NOTE:</strong> Options marked with {MandatoryCompo} is mandatory for compo submissions.</div>
                <div><strong>NOTE:</strong> Options marked with {MandatoryJam} is mandatory for jam submissions.</div>
				<ButtonBase onclick={this.handleChange.bind(this, 'readRules', !state.readRules)}>
                    {state.readRules ? IconChecked : IconUnChecked}
                    I have read and understood <NavLink blank href="/events/ludum-dare/rules"><strong>the rules</strong></NavLink>.
                    {Mandatory}
                </ButtonBase>
                <ButtonBase onclick={this.handleChange.bind(this, 'workedSolo', !state.workedSolo)}>
                    {state.workedSolo ? IconChecked : IconUnChecked}
                    I worked <strong>alone</strong> on the game.
                    {MandatoryCompo}
                </ButtonBase>
                <ButtonBase onclick={this.handleChange.bind(this, 'createdAll', !state.createdAll)}>
                    {state.createdAll ? IconChecked : IconUnChecked}
                    I created all the code, art, music and sounds myself during the LD.
                    {MandatoryCompo}
                </ButtonBase>
                <ButtonBase onclick={this.handleChange.bind(this, 'createdWithin48', !state.createdWithin48)}>
                    {state.createdWithin48 ? IconChecked : IconUnChecked}
                    I created everything during the 48h of the LD.
                    {MandatoryCompo}
                </ButtonBase>
                <ButtonBase onclick={this.handleChange.bind(this, 'includedSource', !state.includedSource)}>
                    {state.includedSource ? IconChecked : IconUnChecked}
                    I included the source code
                    {MandatoryCompo}
                </ButtonBase>
                <ButtonBase onclick={this.handleChange.bind(this, 'createdWithin72', !state.createdWithin72)}>
                    {state.createdWithin72 ? IconChecked : IconUnChecked}
                    I/We created all conents I/we want to be rated for during the 72h of LD.
                    {MandatoryJam}
                </ButtonBase>
                <ButtonBase onclick={this.handleChange.bind(this, 'optedOut', !state.optedOut)}>
                    {state.optedOut ? IconChecked : IconUnChecked}
                    I/We opt out of all voting categories for which we did not do everything ourselves.
                    {MandatoryJam}
                </ButtonBase>
                <ButtonBase onclick={this.handleChange.bind(this, 'willVote', !state.willVote)}>
                    {state.willVote ? IconChecked : IconUnChecked}
                    I/We will participate in playing and voting on other games.
                    {Mandatory}
                </ButtonBase>
                <div class="-footer">
                    The different submission options and ultimately the ability to publish the game
                    will become available depending on your answers.
                </div>
            </ContentCommonBody>
        );
    }
}
