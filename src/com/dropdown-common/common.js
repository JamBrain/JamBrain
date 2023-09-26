import './common.less';

import DropdownBase from 'com/dropdown-base/base';

export default function DropdownCommon( props ) {
	return <DropdownBase {...props} class={`${props.class ?? ''} dropdown-common`} />;
}
