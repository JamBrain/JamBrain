import { Component } from 'preact';
import './container.less';

/** @deprecated */
export default class GridContainer extends Component {
  constructor( props ) {
    super(props);
  }

  render( props ) {
    return (
      <div {...props} class={`grid-container ${props.class ?? ''}`}>
        {props.children}
      </div>
    );
  }
}
