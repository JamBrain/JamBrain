import {h, Component} from 'preact/preact';

import YoutubeEmbed from 'com/autoembed/youtube';


export default class AutoEmbed extends Component {
  constructor( props ) {
    super(props);
  }

  render( props ) {

    switch ( props.link.info.domain ) {
      case "youtube.com":
        return <YoutubeEmbed id={props.link.match} />;
      default:
        console.warn("failed to embed link", props.link);
    }
  }
}
