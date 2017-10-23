import {h, Component} from 'preact/preact';

export default class Col extends Component {
  constructor(props) {
    super(props);
  }

  render({children, flex = 1, flexGrow, flexShrink, flexBasis = 100}) {
    // let props = Object.assign({}, this.props, {
    //   flex: undefined,
    //   flexBasis: undefined,
    //   flexGrow: undefined,
    //   flexShrink: undefined
    // });

    flexGrow = flexGrow != undefined
      ? flexGrow
      : flex;

    flexShrink = flexShrink != undefined
      ? flexShrink
      : flex;

    return (
      <div class="-col" style={`flex: ${flexGrow} ${flexShrink} ${flexBasis}%; max-width: ${flexBasis}%;`} {...this.props}>
        {children}
      </div>
    );
  }
}
