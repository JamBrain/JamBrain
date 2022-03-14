import {h} from 'preact';
import cN from 'classnames';
import {UIButton} from 'com/ui';

export default function BodyNavButton( props ) {
	return <UIButton {...props} />;
}
/*
		var newClass = cN('content-common-nav-button', props.class);

		if ( props.href ) {
			return (
				<UILink disabled={props.disabled} class={newClass} href={props.href} onclick={props.onclick}>
					{props.children}
				</UILink>
			);
		}
		return (
			<UIButton disabled={props.disabled} class={newClass} onclick={props.onclick}>
				{props.children}
			</UIButton>
		);
	}
}
*/
