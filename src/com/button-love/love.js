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

		if ( props.user ) {	
			$NodeLove.GetMy(/*props.user.id,*/ props.node.id)
			.then(r => {
				//console.log( r ) ;
				this.setState({ 'loved': r });
			});
		}

		// TODO: Extract Love from the global love pool (props.node.id)

		this.onLove = this.onLove.bind(this);
	}

	render( {node}, {loved, lovecount} ) {
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

}
