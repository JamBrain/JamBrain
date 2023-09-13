import UIButtonDiv from './button-div';
import UIButtonLink from './button-link';

export default function UIButton( props ) {
	return (props.href) ? <UIButtonLink {...props} /> : <UIButtonDiv {...props} />;
}
