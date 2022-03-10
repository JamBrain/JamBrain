import {h, Component, cloneElement, toChildArray}		from 'preact/preact';
import Route											from './route';
import {pathToRegexp, compile}							from 'external/path-to-regexp/index';

export default class Router extends Component {
/*	constructor( props ) {
		super(props);

		// @ifdef DEBUG
		console.log("[com/router]", "constructor", props);
		// @endif

		//this.state = {
			//"routes": [],
		//	"params": {},
			//"current": null
		//};

//		console.log("Router", "constructor", this.state);
	}

/*
	componentDidMount() {
		let props = this.props;

		if ( props.node && props.node.id ) {
			this.setState({
				"routes": this._parseRoutes(props.children)
			});
			this._getCurrentRoute(props);

			console.log("Router", "componentDidMount", this.state);
		}
	}


	getDerivedStateFromProps( nextProps ) {
		if ( nextProps && nextProps.node && nextProps.node.id ) {
			this.setState({
				"routes": this._parseRoutes(nextProps.children),
				"params": {}
			});
			this._getCurrentRoute(nextProps);

			console.log("Router", "componentWillRecieveProps", this.state);
		}
	}

	shouldComponentUpdate( nextProps ) {
		console.log("[com/router]", "shouldComponentUpdate", nextProps, this.props );
		return true;
	}
*/

	// Works out what the current route is
	_getRoute( routes ) {
		let {node} = this.props.props;

		if ( !node /* || !node.id*/ ) {
			return;
		}

		let currentRoute = null;
		let errorRoute = null;

		for ( let route of routes ) {
			// Does the node match this route's required properties?
			if ( this._doesNodeMatchRoute(route.props, node) ) {
				// Does the node match this route's path
				if ( route.props.path ) {
					if ( !this._doesPropsMatchRoutePath(route.props.path) ) {
						continue;
					}
				}

				currentRoute = route;
			}

			if ( route.props.type == "error" ) {
				errorRoute = route;
			}
		}

		if ( !currentRoute && errorRoute ) {
			return errorRoute;
		}

		//this.setState({"current": currentRoute});
		return currentRoute;
	}


	_doesPropsMatchRoutePath( routePath ) {
		// @ifdef DEBUG
		//console.log("[com/router]", "_doesPathMatchRoute", routePath, this.props);
		// @endif

		if ( Array.isArray(routePath) ) {
			for ( let path of routePath ) {
				if ( this._doesPropsMatchRoutePath(path) ) {
					return true;
				}
			}
			return false;
		}

		let routePathTokens = routePath.split("/").slice(1);
		let propsPathTokens = this.props.props.extra;

		for ( let idx = 0; idx < routePathTokens.length; ++idx ) {
			let token = routePathTokens[idx];

			if ( !token ) {
				// @ifdef DEBUG
				if ( !this.props.children[idx].props.default ) {
					console.warn("Route has blank path token:", idx, routePath, this.props);
				}
				// @endif

				continue;
			}

			// If token is a variable
			if ( token.charAt(0) == ":" ) {
				// If it ends with ? the token is optional
				if ( token.charAt(token.length - 1) == "?" ) {
					continue;
				}
			}

			// Fail if props has no tokens left
			if ( idx >= propsPathTokens.length ) {
				return false;
			}

			// Fail if token and props token aren't the same
			if ( token != propsPathTokens[idx] ) {
				return false;
			}
		}

		// Success
		return true;
	}

/*
	_matchPath( path ) {
		// If path is an array, this becomes a recursive function
		if ( Array.isArray(path) ) {
			for ( let v in path ) {
				if ( this._matchPath(path[v]) ) {
					return true;
				}
			}
			return false;
		}

		// If path isn't an array
		let keys = [];
		let pathRegex = pathToRegexp(path, keys);
		let url = window.location.pathname
			.replace(this.props.node.path, "") //remove path
			.replace("/$" + this.props.node.id, ""); //remove /${nodeid}

		if ( url === "" ) {
			url = "/";
		}

		let params = {};
		let out = pathRegex.exec(url);

		if ( !out ) {
			return false;
		}

		if ( keys.length > 0 ) {
			for ( let i in keys ) {
				let index = parseInt((i) + 1);
				params[keys[i]["name"]] = out[index];
			}
		}

		this.setState({"params": params});
		return true;
	}
*/

	// Checks if a node matches the properties required by the route
	_doesNodeMatchRoute( route, node ) {
		// Optionally let the properties checked be changed by <Router>
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

			let newProps = {...child.props};
			// Optionally merge properties with parent
			if ( parent ) {
				newProps = {...parent.props};

				// Delete children inherited from parent
				if ( parent.props.children ) {
					delete newProps.children;
				}

				// Overwrite newProps with child's props
				Object.assign(newProps, child.props);
			}

			// @ifdef DEBUG
			// MK: This errors when path isn't a string (i.e. Games Filter vs Results Filter)
			//if ( child.props.path && child.props.path.charAt(0) != "/" ) {
			//	console.warn("Route.path does not begin with '/'", child);
			//}
			// @endif

			// If parent and child both have paths, concatenate them
			if ( /*newProps.static &&*/ parent && parent.props.path && child.props.path ) {
				// MK: Array version is untested (unsure if 2nd argument to map is needed given scope)
				newProps.path = Array.isArray(child.props.path) ?
					child.props.path.map(path => parent.props.path + path) :
					parent.props.path + child.props.path;
			}

			if ( newProps.path ) {
				newProps.pathVars = [];

				// Handle path arrays
				let paths = newProps.path;
				if ( !Array.isArray(paths) ) {
					paths = [paths];
				}

				for ( let path of paths ) {
					// Tokenize the path and extract the path variable names
					let tokenizedPath = path.split("/").slice(1);
					for ( let token of tokenizedPath ) {
						if ( !token ) {
							continue;
						}

						// If token begins with a colon, it's a path variable
						if ( token.charAt(0) == ":" ) {
							newProps.pathVars.push(token);
						}
					}
				}
			}

			// If a "default", promote the path to an array (if not) and prefix with the '/' path
			if ( newProps.default && newProps.path ) {
				newProps.path = Array.isArray(newProps.path) ?
					["/", ...newProps.path] :
					["/", newProps.path];
			}

			// Clone the Route
			// MK: This might not have to be a vnode
			let newChild = cloneElement(child, newProps);
			newRoutes.push(newChild);

			// If child has children, recursively parse again
			if ( newChild.props.children ) {
				newRoutes = newRoutes.concat(this._parseRoutes(newChild.props.children, newChild));
			}
		}

		return newRoutes;
	}


	render( props ) {
		let routes = this._parseRoutes(props.children);
		let route = this._getRoute(routes);

		// @ifdef DEBUG
		//console.log("[com/router]", "render", props, routes, route);
		// @endif

		if ( !route ) {
			return <div id="router" />; //null;
		}

		return cloneElement(route, {...props});//, "params": state.params});
		//return cloneElement(route.props.component, {...props});
	}
}
