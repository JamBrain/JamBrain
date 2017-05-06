import {h, Component} from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

export default class LocalLink extends Component {
  constructor(props) {
    super(props);
  }

  render(props, {}) {

    return (
        <span class="smart-link local-link">
            <a path={props.href} href={props.href}>
                <span class="-icon-domain">
                    <SVGIcon baseline small name={'l-udum'}/>
                    <SVGIcon baseline small name={'d-are'}/>
                </span>
                <span class="-the-rest">
                    {props.name}
                </span>
            </a>
        </span>
    );
  }
}
