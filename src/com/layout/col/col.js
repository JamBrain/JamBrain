import {h, Component} from 'preact/preact';

export default class LayoutCol extends Component {
  constructor(props) {
    super(props);
  }

  render( props ) {
    let {flex = 1, flexGrow, flexShrink, flexBasis = 100} = props;

    flexGrow = (flexGrow != null) ? flexGrow : flex;
    flexShrink = (flexShrink != null) ? flexShrink : flex;

    let style = "flex: " + flexGrow + " " + flexShrink + "" + flexBasis + "%; max-width: " + flexBasis + "%;";

    return (
      <div class={cN(this.props.class, "-col")} style={style} {...this.props}>
        {props.children}
      </div>
    );
  }
}
