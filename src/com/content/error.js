import { ContentAside } from "./types";
import './error.less';

/**
 * @param {object} props
 * @param {string} [props.class]
 * @param {number} [props.code=404] HTTP Response code
 * * 400 - **Bad Request** - client error
 * * 401 - **Unauthorized** - requires authentication
 * * 403 - **Forbidden** - you are authenticated, but you can't access this
 * * 404 - **Not Found**
 * * 405 - **Method Not Allowed** - i.e. POST, DELETE
 * * 408 - **Request Timeout**
 * * 410 - **Gone** - permanently deleted with no forwarding address. If used, should only use for a limited time, then 404)
 * * 418 - **I'm a teapot**
 * * 429 - **Too Many Requests** - rate limiting
 * * 451 - **Unavailable For Legal Reasons** - (government) censorship
 * @param {any} [props.children]
 */
export function ContentError( props ) {
	const {code, children, 'class': classProp, ...otherProps} = props;

	return (
		<ContentAside class={`error ${classProp ?? ''}`} {...otherProps}>
			<h1>{code ?? 404}</h1>
			{children}
		</ContentAside>
	);
}
