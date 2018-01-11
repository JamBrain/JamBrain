import {h, Component} from 'preact/preact';
import SVGIcon from 'com/svg-icon/icon';

export default class UIEmbedOverlay extends Component {
  constructor( props ) {
    super(props);

    if (props.link.info.thumbnail) {
      let thumbnail = props.link.info.thumbnail(props);

      console.log("t", thumbnail);

      Promise.resolve(thumbnail).then((url) => {
        this.setState({"thumbnail": url});
      });

      // if(this.isPromise(thumbnail)) {
      //   thumbnail.then((url) => {
      //     console.log("u", url);
      //   });
      // } else {
      //     this.setState({"thumbnail": thumbnail});
      // }
    }

    this.state = {
      'iframe': false
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick( e ) {
    this.setState({'iframe': true});
  }

  isPromise(object){
    if(Promise && Promise.resolve){
      return Promise.resolve(object) == object;
    }
  }

  render( props, state ) {
    let { thumbnail, iframe } = state;

    let Element = <props.link.info.component {...props} />;

    // if ( state.iframe ) {
    //   return (
    //     <props.link.info.component {...props} />
    //   );
    // }

    if ( !thumbnail ) {
      return <div />;
    }

    return (
      <div class="embed-video">
        <div class="-thumbnail">
          <div class="-overlay" onclick={this.onClick} >
            <div class="-play ">
              <SVGIcon middle>play</SVGIcon>
            </div>
            <div class="-external">
              <a href={props.link.url} target="_blank" onclick={(e) => {
                e.stopPropagation();
              }}>
                <SVGIcon middle block>youtube</SVGIcon>
              </a>
            </div>
          </div>
          <img src={thumbnail}/>

          {iframe ? Element : null}
        {/* src={yt_thumbnail_prefix + props.link.match + yt_thumbnail_suffix}/>*/}
        </div>
      </div>
    );
  }
}
