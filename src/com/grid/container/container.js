import {h, Component} from 'preact';
import cN from 'classnames';

/** @deprecated */
export default class GridContainer extends Component {
  constructor( props ) {
    super(props);
  }

  render( props ) {
    return (
      <div {...props} class={cN("grid-container", props.class)}>
        {props.children}
      </div>
    );
  }
}
