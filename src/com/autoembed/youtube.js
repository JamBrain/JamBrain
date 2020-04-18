import {h, Component} from 'preact/preact';
import SVGIcon from 'com/svg-icon/icon';

export default class YoutubeEmbed extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      'iframe': false
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick( e ) {
    this.setState({'iframe': true});
  }

  render( props, state ) {
    var yt_thumbnail_prefix = "https://i.ytimg.com/vi/";
    var yt_thumbnail_suffix = "/mqdefault.jpg";

    var video_id = props.id;

    var args = ['autoplay=1'];
    if ( url.args.t ) {
      args.push('start=' + parseInt(url.args.t));
    }

    if ( state.iframe ) {
      return (
        <div class="embed-video -youtube">
          <div class="-video">
            <iframe src={'https://www.youtube.com/embed/' + video_id + '?' + args.join('&')} frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>
          </div>
        </div>
      );
    }

    return (
      <div class="embed-video -youtube">
        <div class="-thumbnail">
          <div class="-overlay" onclick={this.onClick} >
            <div class="-play">
              <SVGIcon middle>play</SVGIcon>
            </div>
            <div class="-external">
              <a title="Open in new tab" href={"//www.youtube.com/watch?v="+video_id} target="_blank" rel="noopener" onclick={(e) => {
                e.stopPropagation();
              }}>
                <SVGIcon middle block>youtube</SVGIcon>
              </a>
            </div>
          </div>
          <img alt="Youtube video thumbnail" src={yt_thumbnail_prefix + video_id + yt_thumbnail_suffix}/>
        </div>
      </div>
    );
  }
}
