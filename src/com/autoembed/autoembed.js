import {h, Component} from 'preact/preact';

import SmartLink from 'com/autoembed/smartlink';
import LocalLink from 'com/autoembed/locallink';

import YoutubeEmbed from 'com/autoembed/youtube';

import SVGIcon 							from 'com/svg-icon/icon';

export default class AutoEmbed extends Component {
  constructor(props) {
    super(props);
  }

  static hasSmartLink(href) {
    url = extractFromURL(href);

    if (url.domain) {
      if (url.domain.indexOf('youtube.com') !== -1 || url.domain.indexOf('github.com') !== -1 || url.domain.indexOf('twitch.tv') !== -1
      || url.domain.indexOf('reddit.com') !== -1 || url.domain.indexOf('twitter.com') !== -1 || url.domain.indexOf('soundcloud.com') !== -1
      || url.domain.indexOf(window.location.hostname) !== -1 || href.indexOf('//') == 0) {
        return true;
      }
    }
    return false;
  }

  static hasEmbed(href) {
    if (href) {
      url = extractFromURL(href);

      if (url.domain) {
        if (url.domain.indexOf('youtube.com') !== -1) {
          if ((url.paths && url.paths[0] == 'watch') && url.args.v) {
            return true;
          }
        }
      }
    }
    return false;
  }

  render(props, state) {

    url = extractFromURL(props.href);

    var lit = url.domain.replace('www.', '');
    var unlit = url.path + url.query + url.hash;
    // If some text is set, prefer that for the URL
    if (!(props.href == props.text) && props.text) {
      lit = props.text;
      unlit = "";
    }

    if (url.domain) {

      /*
      * Embeded content
      */
      if (url.domain.indexOf('youtube.com') !== -1) {
        if ((url.paths && url.paths[0] == 'watch') && url.args.v) {
          return <YoutubeEmbed href={props.href} />;
        }
      }

      /*
      * Smart Links
      */

      if (url.domain.indexOf('youtube.com') !== -1) {
        return (
          <SmartLink icon_name='youtube' full_url={url.href} domain={lit} part_url={unlit}></SmartLink>
        );
      } else if (url.domain.indexOf('github.com') !== -1) {
        return (
          <SmartLink icon_name='github' full_url={url.href} domain={lit} part_url={unlit}></SmartLink>
        );
      } else if (url.domain.indexOf('twitch.tv') !== -1) {
        return (
          <SmartLink icon_name='twitch' full_url={url.href} domain={lit} part_url={unlit}></SmartLink>
        );
      } else if (url.domain.indexOf('reddit.com') !== -1) {
        return (
          <SmartLink icon_name='reddit' full_url={url.href} domain={lit} part_url={unlit}></SmartLink>
        );
      } else if (url.domain.indexOf('twitter.com') !== -1) {
        return (
          <SmartLink icon_name='twitter' full_url={url.href} domain={lit} part_url={unlit}></SmartLink>
        );
      } else if (url.domain.indexOf('soundcloud.com') !== -1) {
        return (
          <SmartLink icon_name='soundcloud' full_url={url.href} domain={lit} part_url={unlit}></SmartLink>
        );
      } else if (url.domain.indexOf(window.location.hostname) == 0 ) {
        // local links starting pointing to the same domain name e.g. http://ldjam.com/users/mike
        console.log(lit);
        console.log(unlit);
        console.log(url);
        console.log(props);

        return (
          <LocalLink href={url.href} text={(unlit)?url.path:props.text} title={''} target={"_blank"}/>
        );
      } else {
        console.warn("Warn: Unable to autoembed link :" + props.href);
        return (
          <SmartLink icon_name='link' full_url={url.href} domain={lit} part_url={unlit}></SmartLink>
        );
      }
    }
  }
}
