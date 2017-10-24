import {h, Component} from 'preact/preact';

export default class LayoutContainer extends Component {
  constructor( props ) {
    super(props);
  }

  render( props ) {
    return (
      <div {...props} class={cN("layout-container", props.class)}>
        {props.children}
      </div>
    );
  }
}
