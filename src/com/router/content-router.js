import {h} from 'preact';
import {Router} from './router';
import ContentError from 'com/content/error';

export {Route} from './router';

/**
 * @component
 * Wrapper for \<Router> that emits a \<ContentError /> when routes are not found.
 */
export default function ContentRouter( props ) {
	return <Router {...props} on404={<ContentError><p>Route not found</p></ContentError>} />;
}
