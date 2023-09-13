import {Component} from 'preact';
import {UIIcon} from 'com/ui';

export default class FilterSpecial extends Component {
    render ( {text, icon, onClick}, state ) {

        let ShowRemove = null;
        if (onClick) {
            let { value } = this.props;
            if (!value) {
                value = text;
            }
            ShowRemove = <button onClick={() => onClick(value)}><UIIcon>cross</UIIcon></button>;
        }

        return (
            <div class='filter-special'>
                <UIIcon class='icon'>{icon}</UIIcon>{text}
                {ShowRemove}
            </div>
        );
    }
}
