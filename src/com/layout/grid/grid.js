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
      <Container class="-grid">
        {children.map((child, index) => {
          return (
            <Col flexBasis={100 / (columns + 1)}>{child}</Col>
          );
        }, this)}
      </Container>
    );
  }
}
