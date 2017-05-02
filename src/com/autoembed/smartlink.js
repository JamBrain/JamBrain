import {h, Component} from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

export default class SmartLink extends Component {
  constructor(props) {
    super(props);
  }

  render(props, {}) {
    return (
      <span class="smart-link">
        <a href={props.full_url} target="_blank" rel="noopener noreferrer">
          <span class="-icon-domain">
            <SVGIcon baseline small>{props.icon_name}</SVGIcon>
            <span class="-domain">{props.domain}</span>
          </span>
          <span class="-the-rest">{props.part_url}</span>
        </a>
      </span>
    );
  }
}
