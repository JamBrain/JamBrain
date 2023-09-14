import { toChildArray } from 'preact';
import './grid.less';

import GridCol from 'com/grid/col/col';
import GridRow from 'com/grid/row/row';
import GridContainer from 'com/grid/container/container';

/** @deprecated */
export default function Grid( props ) {
	let {columns = 3} = props;

	return (
		<GridContainer {...props} class={`-grid ${props.class ?? ''}`}>
			{
					toChildArray(props.children).map((child, index) => {
						return (
							<GridCol flexGrow={0} flexBasis={100 / columns}>{child}</GridCol>
						);
				})
			}
		</GridContainer>
	);
}
