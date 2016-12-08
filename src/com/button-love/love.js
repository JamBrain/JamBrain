import { h, Component } 				from 'preact/preact';

import SVGIcon 							from 'com/svg-icon/icon';

import $NodeLove						from '../../shrub/js/node/node_love';

export default class LoveButton extends Component {
  constructor( props ) {
		super(props);

		this.state = {
			'loved': null,
			'lovecount': null
		};

		$NodeLove.GetMy(/*props.user.id,*/ props.node.id)
		.then(r => {
			//console.log( r ) ;
			this.setState({ 'loved': r });
		});

		// TODO: Extract Love from the global love pool (props.node.id)

		this.onLove = this.onLove.bind(this);
	}

	render( {node,user}, {loved, lovecount} ) {
		return (
      <div class={'-love'+ (loved ? ' loved' : '')} onclick={this.onLove}>
        <SVGIcon class="-hover-hide">heart</SVGIcon>
        <SVGIcon class="-hover-show -loved-hide">heart-plus</SVGIcon>
        <SVGIcon class="-hover-show -loved-show">heart-minus</SVGIcon>
        <div class="-count">{Number.isInteger(lovecount) ? lovecount : node.love}</div>
      </div>
    )
	}

  onLove( e ) {
      // if we have a user let them love stuff else get them to log on
      if( this.props.user && this.props.user.id ){
          // user is logged on so they can love stuff
          if ( this.state.loved ) {
              $NodeLove.Remove(this.props.node.id)
              .then(r => {
                  this.setState({ 'loved': false, 'lovecount': r.love.count });
              });
          }
          else {
              $NodeLove.Add(this.props.node.id)
              .then(r => {
                  this.setState({ 'loved': true, 'lovecount': r.love.count });
              });
          }
      }
      else {
          // user isnt logged on so they cannot love stuff

          // if secure login mode is on and were not on the secure site , then go to the secure site
          if ( SECURE_LOGIN_ONLY && (window.location.protocol !== 'https:')) {
              let SecureURL = 'https://'+window.location.hostname+window.location.pathname+window.location.search+window.location.hash;
              window.location.href = SecureURL;
          }

          // user isnt logged on so prompt them to log on
          console.log('login');
          window.location.hash = "#user-login";

          //TODO: shouldnt the login script disallow insecure logins itself, rather than relying
          // on whoever is calling it to check ???
    }
  }
}
