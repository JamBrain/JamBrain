import {h, Component} from 'preact/preact';
import LayoutGrid from 'com/layout/grid/grid';
import GridSelector from 'com/layout/grid/grid-selector';

export default class LayoutChangeableGrid extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      'columns': 3
    };
  }

  render( props, state ) {
    let {columns} = state;

    return (
      <div>
        <GridSelector
          defaultLayout={columns}
          onChangeLayout={
            (gridLayout) => {
              this.setState({'columns': gridLayout});
            }
          }
        />
        <LayoutGrid {...props} columns={columns} class={cN(props.class, "-selectable")}>
          {props.children}
        </LayoutGrid>
      </div>
    );
  }
}
