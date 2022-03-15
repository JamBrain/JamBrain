import {h} from 'preact';
import {Router} from './router';
import ContentError from 'com/content-error/error';

export {Route} from './router';

/** Wrapper for \<Router> that emits a 404 \<ContentError /> when routes are not found. */
export default function ContentRouter( props ) {
	return <Router {...props} on404={<ContentError><p>Route not found</p></ContentError>} />;
}
