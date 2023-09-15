import {Component} from 'preact';
import {Icon} from 'com/ui';

export default class FilterSpecial extends Component {
    render ( {text, icon, onClick}, state ) {

        let ShowRemove = null;
        if (onClick) {
            let { value } = this.props;
            if (!value) {
                value = text;
            }
            ShowRemove = <button onClick={() => onClick(value)}><Icon>cross</Icon></button>;
        }

        return (
            <div class='filter-special'>
                <Icon class='icon'>{icon}</Icon>{text}
                {ShowRemove}
            </div>
        );
    }
}
