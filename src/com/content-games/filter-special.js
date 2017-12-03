import { h, Component } from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';

export default class FilterSpecial extends Component {

    render ( {text, icon, onclick}, state ) {

        let ShowRemove = null;
        if (onclick) {
            let { value } = this.props;
            if (!value) {
                value = text;
            }
            ShowRemove = <button onclick={() => onclick(value)}><SVGIcon>cross</SVGIcon></button>;
        }

        return (
            <div class='filter-special'>
                <SVGIcon class='icon'>{icon}</SVGIcon>{text}
                {ShowRemove}
            </div>
        );
    }
}
