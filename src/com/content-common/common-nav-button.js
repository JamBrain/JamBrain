import './common-nav-button.less';

import {UIButton} from 'com/ui';

export default function BodyNavButton( props ) {
	return <UIButton {...props} />;
}
/*
		var newClass = cN('content-common-nav-button', props.class);

		if ( props.href ) {
			return (
				<UILink disabled={props.disabled} class={newClass} href={props.href} onClick={props.onClick}>
					{props.children}
				</UILink>
			);
		}
		return (
			<UIButton disabled={props.disabled} class={newClass} onClick={props.onClick}>
				{props.children}
			</UIButton>
		);
	}
}
*/
