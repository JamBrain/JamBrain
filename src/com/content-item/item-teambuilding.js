import {h, Component} from 'preact/preact';
import ContentCommonBody from 'com/content-common/common-body';
import ContentLoading	from 'com/content-loading/loading';
import UIIcon	from 'com/ui/icon/icon';
import UIButton	from 'com/ui/button/button';
import UIDropdown	from 'com/ui/dropdown/dropdown';
import SVGIcon from 'com/svg-icon/icon';
import $Node from '../../shrub/js/node/node';

export default class ItemTeambuilding extends Component {
  constructor(props) {
    super(props);
    this.state = {'friends': [], 'processing': false};
    this.removeFromTeam = this.removeFromTeam.bind(this);
    this.addToTeam = this.addToTeam.bind(this);
  }

  componentDidMount() {
      this.loadFriends();
  }

  removeFromTeam(userId) {
    const {featured, node, onChange} = this.props;
    this.setState({'processing': userId});
			$Node.RemoveLink(node.id, userId, {'author': null})
			.then(() => {
        this.setState({
          'processing': false,
          'error': null,
        });
        onChange(userId, -1);
			})
			.catch( err => {
				this.setState({
          'error': `Requesting removing user ${userId} caused ${err}`,
          'processing': false,
        });
			});
  }

  addToTeam(userId) {
    const {featured, node, onChange} = this.props;
    console.log(userId);
    this.setState({'processing': userId});
		$Node.AddLink(node.id, userId, {'author': null})
			.then(() => {
        this.setState({'processing': false});
        onChange(userId, 1);
			})
			.catch( err => {
				this.setState({'error': err, 'processing': false});
			});
  }

  loadFriends() {
    $Node.GetMy()
      .then(r => {

        $Node.Get(r.meta.star.filter(id => r.refs.star.indexOf(id) > -1))
          .then(r => {
            this.setState({'friends': r.node});
          })
          .catch(e => this.setState({'error': `Error fetching friends ${e}`}));
      })
      .catch(e => this.setState({'error': `Error getting friends-list ${e}`}));
  }

  renderUser(user, me, mainAuthor) {
    const isMe = user.id === me;
    const isMain = user.id === mainAuthor;
    const canBeRemoved = (isMe && !isMain) || (!isMe && mainAuthor === me);
    return (
      <li class="team-list-member">
        <SVGIcon>user</SVGIcon>
        <strong>{user.name}</strong>
        {isMe && ' (you)'}
        {isMain && ' (main author)'}
        {canBeRemoved && <UIButton class="team-member-remove" onclick={() => this.removeFromTeam(user.id)} title="Remove from team"><SVGIcon>cross</SVGIcon></UIButton>}
      </li>
    );
  }

  renderAddUser(friend) {
    console.log('render', friend.id);
    return (
        <UIButton onclick={() => this.addToTeam(friend.id)} key={friend.id}>
          <UIIcon>user</UIIcon><span>{friend.name}</span>
        </UIButton>
    );
  }

  renderAdder(authors) {
    const {friends} = this.state;
    if (!friends) return;
    const authorIds = authors.map(author => author.id);
    const Addable = friends
      .filter(friend => authorIds.indexOf(friend.id) === -1)
      .sort((a, b) => (a > b) ? -1 : 1)
      .map(friend => this.renderAddUser(friend));
    if (Addable.length > 0) {
      return (
        <div class="team-list-add">
          <UIDropdown>
            <div class="team-list-add-header">Add to team<SVGIcon>arrow-down</SVGIcon></div>
            {Addable}
          </UIDropdown>
        </div>
      );
    }
  }

  render(props, {processing, error}) {
    const {node, user, authors} = props;
    const ShowTeamBuilding = [];
    if (node.type != 'item') return;
    let includeBuilding = true;
    let includeAdding = node_IsAuthor(node, user) && !processing;

    if (node.subsubtype == 'compo') {
      if (authors.length < 2) {
        ShowTeamBuilding.push(<div>Since your {node.subtype} competing in the compo, you cannot add others to your game</div>);
        includeBuilding = false;
      }
      else if (authors.length > 0) {
        ShowTeamBuilding.push(<div class="team-building-warning">Your {node.subtype} is competing in the compo, but you are more than one author. This is against the rules</div>);
        includeAdding = false;
      }
    }

    if (includeBuilding) {
      const Team = authors
        .sort((a, b) => (a.id === node.author && -1) || (b.id === node.author && 1) || (a.name > b.name ? -1 : 1))
        .map(author => this.renderUser(author, user.id, node.author));
      const Adder = includeAdding && this.renderAdder(authors);
      ShowTeamBuilding.push((
        <ul class="team-list">
          {Team}
          {Adder}
          {processing && <ContentLoading />}
        </ul>
      ));
      if (includeAdding && !Adder) {
        ShowTeamBuilding.push((
          <div class="-footer">
            To be able to add people, they need to be friends with you.
            All your friends are already added to this game. Go team!
          </div>
        ));
      }
    }
    return (
			<ContentCommonBody class="team-building">
				<div class="-label">Team Building</div>
        <div class="-body">
          {ShowTeamBuilding}
          {error &&
            <div class="team-building-warning">{error}</div>
          }
        </div>
			</ContentCommonBody>
    );
  }
}
