import {h, Component} from 'preact/preact';
import Grid from 'com/layout/grid/grid';
import GridSelector from 'com/layout/grid/grid-selector';

export default class SelectableGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
			'columns': 3
		};
  }

  render(props, {columns}) {
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
        <Grid {...props} columns={columns} class={cN([props.class, "-selectable"])}>
          {props.children}
        </Grid>
      </div>
    );
  }
}
