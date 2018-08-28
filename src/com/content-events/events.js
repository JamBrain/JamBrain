import {h, Component} from 'preact/preact';
import Common from 'com/content-common/common';
import CommonBody	from 'com/content-common/common-body';
import ContentCommonBody from 'com/content-common/common-body';
import ContentCommonNav from 'com/content-common/common-nav';
import ContentCommonNavButton	from 'com/content-common/common-nav-button';
import SVGIcon from 'com/svg-icon/icon';
import UIButton from 'com/ui/button/button';
import UILink from 'com/ui/link/link';

import $Node from '../../shrub/js/node/node';

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

  render(props, {items, nodes}) {
    const ShowUtilPages = [];
    const ShowEvents = [];
    const {node, user} = props;
    const ShowBody = node && node.body;
    const ShowHeader = node && node.name;
    if (items && items.lenght && nodes) {
        items.forEach(item => {
          let n = nodes[item];
          if (n.type === 'event') {
            const isLD = n.name.indexOf('Ludum Dare');
            let Icon = <SVGIcon gap>gamepad</SVGIcon>;
            if (isLD || true) {
              Icon = (
                <span>
                  <SVGIcon gap>l-udum</SVGIcon>
                  <SVGIcon gap>d-are</SVGIcon>
                </span>
              );
            }
            const theme = n.meta['event-theme'];
            const yourGame = n.what && n.what.length && n.what_node && n.what_node[n.what[0]];
            const themeMode = this.getThemeModeName(n.meta['theme-mode'], theme);
            ShowEvents.push(
              <div class="event-listing">
                {Icon}
                <UILink href={n.path}>{n.name}</UILink>
                <span class="-theme-mode">[{themeMode}]</span>
                {theme && theme.length && <div class='-theme'>{theme}</div>}
                {yourGame && (
                  <div class="-your-game">
                    <SVGIcon gap>gamepad</SVGIcon>
                    <UILink href={yourGame.path}>{yourGame.name}</UILink>
                  </div>
                )}
              </div>
            );
          } else if (n.type === 'group') {
            ShowEvents.push(
              <div class="group-listing">
                <SVGIcon gap>gamepad</SVGIcon>
                <UILink href={n.path}>{n.name}</UILink>
                {n.body && <ContentCommonBody class="-description">{n.body}</ContentCommonBody>}
              </div>
            );

          } else {
            ShowUtilPages.push(
              <UIButton href={n.path}>{n.name}</UIButton>
            );
          }
        });
    }
    return (
			<Common node={node} user={user} header={node.name.toUpperCase()}>
        <CommonBody>
          <div class="-header">{ShowHeader}</div>
          {ShowUtilPages && ShowUtilPages.length && (
            <ContentCommonNav>{ShowUtilPages}</ContentCommonNav>
          )}
          {ShowBody &&
            <ContentCommonBody>{ShowBody}</ContentCommonBody>
          }
          {ShowEvents}
        </CommonBody>
      </Common>
    );
  }
}
