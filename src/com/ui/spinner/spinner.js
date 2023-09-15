import './spinner.less';
import {Icon} from '../icon';

export function UISpinner() {
	// NOTE: We used to need an extra div for IE, which can't apply transformations to SVG elements
	return <div class="ui-spinner" aria-live="assertive"><Icon>spinner</Icon></div>;
}
