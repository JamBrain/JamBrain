import {h, Component} from 'preact/preact';
import LayoutCol from 'com/layout/col/col';
import LayoutRow from 'com/layout/row/row';
import LayoutContainer from 'com/layout/container/container';

export default class LayoutGrid extends Component {
  constructor( props ) {
    super(props);
  }

  render( props ) {
    let {columns = 3} = props;

    return (
      <LayoutContainer {...props} class={cN(props.class, "-grid")}>
        {
            props.children.map((child, index) => {
              return (
                <LayoutCol flexGrow={0} flexBasis={100 / columns}>{child}</LayoutCol>
              );
          })
        }
      </LayoutContainer>
    );
  }
}
