import {h, Component} from 'preact/preact';
import SVGIcon from 'com/svg-icon/icon';
import NavSpinner from 'com/nav-spinner/spinner';

export default class UIEmbedOverlay extends Component {
  constructor( props ) {
    super(props);

    if (props.link.info.thumbnail) {
      let thumbnail = props.link.info.thumbnail(props);

      Promise.resolve(thumbnail).then((url) => {
        this.setState({"thumbnail": url});
      });

      this.onIframeLoad = this.onIframeLoad.bind(this);
    }

    this.state = {
      'iframe': false,
      "loaded": false
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick( e ) {
    this.setState({'iframe': true});
  }

  onIframeLoad() {
    this.setState({"loaded": true});
  }

  componentWillUpdate() {
    if(this.component) {
        this.component.base.addEventListener('load', this.onIframeLoad);
    }
  }

  render( props, state ) {
    let { thumbnail, iframe, loaded } = state;

    let Element = (
      <div class="-element">
        <props.link.info.component {...props} ref={(component) => {this.component = component;}} onLoad={this.onIframeLoad} />
      </div>
    );

    let Icon = <SVGIcon middle>play</SVGIcon>;
    if ( iframe && !loaded ) {
      Icon = <NavSpinner />;
    }

    if ( !thumbnail ) {
      return <div />;
    }

    return (
      <div class="embed-overlay">
        <div class="-preview">
        {iframe ? Element : null}
          <div class="-overlay" onclick={this.onClick} >
            <div class="-icon ">
              {Icon}
            </div>
            <div class="-external">
              <a href={props.link.url} target="_blank" onclick={(e) => {
                e.stopPropagation();
              }}>
                <SVGIcon middle block>earth</SVGIcon>
              </a>
            </div>
          </div>
          <div class="-thumbnail">
          </div>
          <img style={loaded ? "visibility: hidden;" : ""} src={thumbnail}/>
        </div>
      </div>
    );
  }
}
