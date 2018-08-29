import {h, Component} from 'preact/preact';
import Common from 'com/content-common/common';
import CommonBody from 'com/content-common/common-body';
import ContentCommonNav from 'com/content-common/common-nav';
import ContentCommonNavButton from 'com/content-common/common-nav-button';
import ContentCommonBodyMarkup from 'com/content-common/common-body-markup';
import ContentLoading from 'com/content-loading/loading';
import SVGIcon from 'com/svg-icon/icon';
import UIButton from 'com/ui/button/button';
import UILink from 'com/ui/link/link';

import $Node from '../../shrub/js/node/node';
import $ThemeHistory from '../../shrub/js/theme/theme_history';

export default class ContentEvents extends Component {
  componentDidMount() {
    let props = this.props;
    let node = props.node;

    $Node.GetFeed(node.id, 'parent', ['group', 'event', 'page', 'tag'])
      .then(r => {
        if ( r && r.feed ) {
          this.setState({'items': r.feed});

          return $Node.GetKeyed(r.feed);
        }
      })
      .then( r => {
        if ( r && r.node ) {
          this.setState({'nodes': r.node});
        }
      });
    $Node.GetMy()
      .then(r => {
        $Node.Get(r.refs.author)
          .then(r2 => {
            const myGames = {};
            Object.entries(r2.node)
              .filter(([k, n]) => n.type === 'item')
              .forEach(([k, n]) => {
                if (myGames[n.parent]) {
                  myGames[n.parent].push(n);
                }
                else {
                  myGames[n.parent] = [n];
                }
              });
            this.setState({'myGames': myGames});
          });
      });

    $ThemeHistory.Get().then(r => {
      this.setState({'oldLD': r.history.filter(e => e.name.indexOf('Ludum') === 0)});
    });
  }

  getThemeModeName(mode, theme) {
    switch (mode) {
      case '0':
        return 'Planned';
      case '1':
        return 'Theme Suggestion';
      case '2':
        return 'Theme Slaughter';
      case '3':
        return 'Theme Fusion';
      case '4':
        return 'Theme Voting';
      case '5':
        return theme ? 'Jamming' : 'Starting Soon';
      case '6':
        return 'Play and Rate';
      case '7':
        return 'Compiling Results';
      case '8':
        return 'Completed';
      default:
        return null;
    }
  }

  render(props, {items, nodes, myGames, oldLD}) {
    const ShowUtilPages = [];
    const ShowEvents = [];
    const {node, user} = props;
    const ShowBody = node && node.body;
    const ShowHeader = node && node.name;
    if (items && nodes) {
        items.forEach(item => {
          let n = nodes[item.id];
          if (n.type === 'event') {
            const isLD = n.name.indexOf('Ludum Dare') === 0;
            let Icon = <SVGIcon gap>trophy</SVGIcon>;
            if (isLD) {
              Icon = (
                <span>
                  <SVGIcon gap>l-udum</SVGIcon>
                  <SVGIcon gap>d-are</SVGIcon>
                </span>
              );
            }
            const theme = n.meta['event-theme'];
            const ShowYourGames = [];
            if (myGames && myGames[n.id]) {
              myGames[n.id].forEach(g => {
                ShowYourGames.push((
                  <div class="-your-game" key={g.id}>
                    <SVGIcon gap>gamepad</SVGIcon>
                    Your entry: <UILink href={g.path}>{g.name}</UILink>
                  </div>
                ));
              });
            }
            const themeMode = this.getThemeModeName(n.meta['theme-mode'], theme);
            ShowEvents.push(
              <div class="event-listing">
                {Icon}
                <UILink href={n.path}>{n.name}</UILink>
                {theme && theme.length > 0 && <span class="-theme">{theme}</span>}
                <span class="-theme-mode">[{themeMode}]</span>
                {ShowYourGames}
              </div>
            );
          }
          else if (n.type === 'group') {
            ShowEvents.push(
              <div class="group-listing">
                <SVGIcon gap>gamepad</SVGIcon>
                <UILink href={n.path}>{n.name}</UILink>
                {n.body && <ContentCommonBodyMarkup class="-description">{n.body}</ContentCommonBodyMarkup>}
              </div>
            );

          }
          else {
            ShowUtilPages.push(
              <UILink href={n.path} class="ui-button">{n.name}</UILink>
            );
          }
        });
    }
    if (oldLD && node.name.indexOf('Ludum') === 0) {
      oldLD
        .sort((a, b) => parseInt(b.shorthand.match(/\d+/)) - parseInt(a.shorthand.match(/\d+/)))
        .forEach(e => {
            const href = parseInt(e.shorthand.match(/\d+/)) > 14 ? `http://ludumdare.com/compo/ludum-dare-${e.shorthand.match(/\d+/)}` : null;
            ShowEvents.push(
              <div class="event-listing">
                <span>
                  <SVGIcon gap>l-udum</SVGIcon>
                  <SVGIcon gap>d-are</SVGIcon>
                </span>
                {href ? <UILink href={href}>{e.name}</UILink> : <span class="-old-event">{e.name}</span>}
                <span class="-theme">{e.theme}</span>
                <span class="-theme-mode">[Completed]</span>
              </div>
            );
        });
    }
    let Header;
    if (!items || !nodes) {
      Header = <ContentLoading />;
    }
    else if (ShowEvents.length == 0 && ShowUtilPages.length == 0) {
      Header = <div class="-warning">No content here yet!</div>;
    }
    else {
      Header = <div class="header-gap" />;
    }
    return (
      <Common node={node} user={user} header={node.name.toUpperCase()}>
        <CommonBody class="events-group">
          {Header}
          {ShowBody &&
            <ContentCommonBodyMarkup>{ShowBody}</ContentCommonBodyMarkup>
          }
          {ShowUtilPages.length > 0 && (
            <ContentCommonNav>{ShowUtilPages}</ContentCommonNav>
          )}
          {ShowEvents}
        </CommonBody>
      </Common>
    );
  }
}
