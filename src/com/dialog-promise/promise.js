import {h, Component} from 'preact/preact';
import DialogCommon from 'com/dialog-common/common';

export default class DialogRegister extends Component {
  constructor(props) {
    super(props);

    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onConfirm() {
    this.props.resolve(true);
    this.base.remove();
  }

  onCancel() {
    this.props.resolve(false);
    this.base.remove();
  }

  render(props, state) {
    return (
      <DialogCommon onok={this.onConfirm} oncancel={this.onCancel} {...props}>
        {props.children}
      </DialogCommon>
    );
  }
}
