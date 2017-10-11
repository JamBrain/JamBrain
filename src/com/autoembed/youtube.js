import {h, Component} from 'preact/preact';
import SVGIcon from 'com/svg-icon/icon';

export default class YoutubeEmbed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'iframe': false
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    this.setState({'iframe': true});
  }

  render(props, state) {
    var yt_thumbnail_prefix = "https://i.ytimg.com/vi/";
    var yt_thumbnail_suffix = "/mqdefault.jpg";

    var url = extractFromURL(props.href);
    var video_id = url.args.v;

    var args = ['autoplay=1'];
    if (url.args.t) {
      args.push('start=' + parseInt(url.args.t));
    }

    if (state.iframe) {
      return (
        <div class="embed-video -youtube">
          <div class="-video">
            <iframe src={'https://www.youtube.com/embed/' + video_id + '?' + args.join('&')} frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      );
    }

    return (
      <div class="embed-video -youtube">
        <div class="-thumbnail">
          <div class="-overlay" onclick={this.onClick} href={props.href}>
            <div class="-play">
              <SVGIcon middle>play</SVGIcon>
            </div>
            <div class="-external">
              <a href={props.href} target="_blank" onclick={(e) => {e.stopPropagation();}}>
                <SVGIcon middle block>youtube</SVGIcon>
              </a>
            </div>
          </div>
          <img src={yt_thumbnail_prefix + video_id + yt_thumbnail_suffix}/>
        </div>
      </div>
    );
  }
}
