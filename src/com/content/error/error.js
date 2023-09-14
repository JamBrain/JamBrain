import { CommonSection } from "../common";
import './error.less';

/**
 * @component
 * @param {object} props
 * @param {any} [props.children]
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
 */
export default function ContentError( props ) {
	let errorCode = props.code ? props.code : 404;

	return (
		<CommonSection class="-error -transparent">
			<h1>{errorCode}</h1>
			<p>{props.children}</p>
		</CommonSection>
	);
}
