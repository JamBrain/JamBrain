import {h, Component} from 'preact/preact';
import Col from 'com/layout/col/col';
import Row from 'com/layout/row/row';
import Container from 'com/layout/container/container';

export default class Grid extends Component {
  constructor(props) {
    super(props);
  }

  render( {children, columns = 3} ) {
    return (
      <Container {...this.props} class={[...this.props.class, " -grid"]}>
        {children.map((child, index) => {
          return (
            <Col flexGrow={0} flexBasis={100 / (columns)}>{child}</Col>
          );
        }, this)}
      </Container>
    );
  }
}
