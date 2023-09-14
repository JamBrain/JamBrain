import { Component } from 'preact';
import cN from 'classnames';

import Grid from 'com/grid/grid';
import GridSelector from 'com/grid/grid-selector';

/** @deprecated */
export default class ChangeableGrid extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      'columns': 4
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
        <Grid {...props} columns={columns} class={`${props.class ?? ''} -selectable`}>
          {props.children}
        </Grid>
      </div>
    );
  }
}
