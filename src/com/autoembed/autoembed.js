import { h, Component } from "preact/preact";

import YoutubeEmbed from "com/autoembed/youtube";
import UIEmbedFrame from "com/ui/embed-frame/embed-frame";

export default class AutoEmbed extends Component {
  constructor(props) {
    super(props);
  }

  render(props) {
    switch (props.link.info.domain) {
      case "youtube.com":
      case "youtu.be":

        return <YoutubeEmbed id={props.link.match} />;
        break;
      case "soundcloud.com":
      case "itch.io":
      case "twitter.com":
        return <UIEmbedFrame url={props.link.url} id={props.link.match} />;
        break;
      default:
        console.warn("failed to embed link", props.link);
        break;
    }
  }
}
