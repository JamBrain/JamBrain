import { Component, Fragment, toChildArray } from 'preact';


export function Route(props) {
	return <Fragment />;
}


export class Router extends Component {
	_findRoute( routes, node, pathTokens ) {
		let ret = null;
		let error = null;

		for ( let route of routes ) {
			// Does the node match the route's required properties?
			if ( this._doesNodeMatchRoute(route, node) ) {
				// Bail if the node doesn't match one of route's path(s)
				if ( route.path && !this._doesPathMatchRoutePath(route.path, pathTokens) ) {
					continue;
				}

				// If not an error route, we have a candidate!
				if ( !route.error ) {
					ret = route;
				}
				// Remember the error only if we haven't encountered one
				else if ( !error ) {
					error = route;
				}
			}
		}

		// Return the last found route, or an error
		return ret ? ret : error;
	}


	_doesPathMatchRoutePath( routePath, pathTokens ) {
		// If routePath is an array, recursively call self
		if ( Array.isArray(routePath) ) {
			for ( let path of routePath ) {
				if ( this._doesPathMatchRoutePath(path, pathTokens) ) {
					return true;
				}
			}
			return false;
		}

		// If not "/", split the path at the slashes, then remove the first (i.e. it should be blank)
		// CLEVER: splitting an empty string, then slicing off the first element makes it an empty array.
		//   The alternative would be to slice before splitting (removing the "/"), but then you'd have
		//   to deal with an array containing a single empty string (which the initial check resolves).
		let routeTokens = (routePath == "/") ? [] : routePath.split("/").slice(1);

		for ( let idx = 0; idx < routeTokens.length; ++idx ) {
			let routeToken = routeTokens[idx];

			// Bail if token is invalid or optional (ends with a ?)
			if ( !routeToken || routeToken.charAt(routeToken.length - 1) == "?" ) {
				continue;
			}

			// Success if we hit an asterisk
			if ( routeToken == "*" ) {
				return true;
			}

			// Fail if path has no tokens left
			if ( idx >= pathTokens.length ) {
				return false;
			}

			let pathToken = pathTokens[idx];

			// Bail if route token is a variable and not empty (NOTE: make optional if empty should be allowed)
			if ( routeToken.charAt(0) == ":" && pathToken ) {
				continue;
			}

			// Fail if token's aren't the same
			if ( routeToken != pathToken ) {
				return false;
			}
		}

		// Success if path is no larger than the route (NOTE: include an asterisk to allow larger)
		return pathTokens.length <= routeTokens.length;
	}

/*
	_lookupPathVars( routePath, pathTokens ) {
		let pathVars = {};

		// // If routePath is an array, recursively call self
		// if ( Array.isArray(routePath) ) {
		// 	for ( let path of routePath ) {
		// 		if ( this._doesPathMatchRoutePath(path, pathTokens) ) {
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// }

		let routeTokens = routePath.split("/").slice(1);

		for ( let idx = 0; idx < routeTokens.length; ++idx ) {
			let routeToken = routeTokens[idx];

			// Bail if token is invalid or not a variable
			if ( !routeToken && (routeToken.charAt(0) != ":") ) {
				continue;
			}

			// Slice off ":" prefix
			routeToken = routeToken.slice(1);

			// Bail if token is invalid
			if ( !routeToken ) {
				continue;
			}

			// If optional
			if ( routeToken.charAt(routeToken.length - 1) == "?" ) {

			}

			// Fail if props has no tokens left
			if ( idx >= pathTokens.length ) {
				return false;
			}

			let pathToken = pathTokens[idx];

			// Bail if route token is a variable and not empty (NOTE: make it optional if empty is allowed)
			if ( !routeToken && !routeToken.charAt(0) == ":" ) {
				continue;
			}

			// Fail if token's aren't the same
			if ( routeToken != pathToken ) {
				return false;
			}
		}

		// Success
		return true;
	}
*/

	// Checks if a node matches the properties required by the route
	_doesNodeMatchRoute( route, node ) {
		// Optionally let the Router change what properties are checked
		let matchProps = this.props.match ? this.props.match : ["type", "subtype", "subsubtype"];

		for ( let prop of matchProps ) {
			let routeValue = route[prop];
			let nodeValue = node[prop];

			// If the route omits it, continue
			if ( !routeValue ) {
				continue;
			}

			// If the node omits it, fail
			if ( !nodeValue ) {
				return false;
			}

			// If route has an array of values, fail if not included
			if ( Array.isArray(routeValue) ) {
				if ( !routeValue.includes(nodeValue) ) {
					return false;
				}
			}
			// Otherwise, fail if not equal
			else if ( routeValue != nodeValue ) {
				return false;
			}
		}

		// Success
		return true;
	}


	_parseRoutes( children, parent ) {
		children = toChildArray(children);

		let newRoutes = [];

		// Iterate through all children, merging and flattening
		for ( let child of children ) {
			// Bail if not a Route
			if ( !child || (child.type !== Route) ) {
				continue;
			}

			// Copy props, optionally merging it with parent
			let newProps = parent ?
				{...parent.props, ...child.props} :
				{...child.props};

			// Remove children
			if ( newProps.children ) {
				delete newProps.children;
			}

			// If parent and child both have paths, concatenate them
			if ( parent && parent.props.path && child.props.path ) {
				// MK: Array version is untested (unsure if 2nd argument to map is needed given scope)
				newProps.path = Array.isArray(child.props.path) ?
					child.props.path.map(path => parent.props.path + path) :
					parent.props.path + child.props.path;
			}

			// Add the route
			newRoutes.push(newProps);

			// If child has children, recursively parse their routes
			if ( child.props.children ) {
				// Instead of calling cloneElement, we fake it, since all we actually use are the parent's props
				newRoutes = newRoutes.concat(this._parseRoutes(child.props.children, {props: newProps}));
			}
		}

		// Return routes
		return newRoutes;
	}


	render( props ) {
		let outputProps = props.props;

		// If no node, we're done
		if ( !outputProps || !outputProps.node || !outputProps.node.id ) {
			return <Fragment />;
		}

		// Pre-populate the routes list with some defaults
		let routes = props.nodefault ? [] : [
			{path: "/edit"},	// Black hole (no component) for edit
		];

		// Parse the routes and append them to the list
		routes = routes.concat(this._parseRoutes(props.children));

		// Find the route to the node
		let route = this._findRoute(routes, outputProps.node, outputProps.extra);

		// MK: TODO consider https://preactjs.com/tutorial/06-context
		// MK: The preact tutorial describes a Router where the component uses its
		// children rather than a property "component" we instantiate. I guess we
		// could do that too, essentially make the final return handle arrays
		// (i.e. toChildArray) and merge the props.

		// If no route, we 404
		if ( !route ) {
			return props.on404 ? props.on404 : <Fragment />;
		}

		// If route doesn't have a component, then we're done
		if ( !route.component ) {
			return <Fragment />;
		}

		// TODO: Parse path args. {pathArgs, ...outputProps}
		return h(route.component, outputProps);

		// MK: Possible implementation of the above. Right now we're passing functions
		// around, functions that get instantiated above. Switching to children would
		// mean we instantiate earlier (i.e children={<SomePage/>}), before we know
		// any values. This has the added effect of
		//return cloneElement(route.props.children, outputProps);
	}
}
