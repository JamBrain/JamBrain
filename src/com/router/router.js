import {h, Component, cloneElement}		from 'preact/preact';
import Route							from './route';
import {pathToRegexp, compile}			from 'external/path-to-regexp/index';

export default class Router extends Component {
	constructor( props ) {
		super(props);

		let match = this.props.match ? this.props.match : ["type", "subtype", "subsubtype"];

		this.state = {
			"routes": [],
			"current": null,
			"match": match,
			"params": {}
		};

		if ( this.props.node.id !== 0 ) {
			this.flattenRoutes(this.props.children);
			this.getCurrentRoute();
		}
	}

	// Works out what the current route is
	getCurrentRoute( nextProps ) {
		let {node} = nextProps ? nextProps : this.props;
		let {routes} = this.state;

		if ( !node ) {
			return;
		}

		let currentRoute, errorRoute;

		for ( let i in routes ) {
			let route = routes[i];

			if ( this.matchRoute(route.attributes, node) ) {
				if ( route.attributes.static && route.attributes.path ) {
					if ( !this.matchPath(route.attributes.path) ) {
						continue;
					}
				}
				currentRoute = route;
			}

			if ( route.attributes.type == "error" ) {
				errorRoute = route;
			}
		}

		if ( !currentRoute && errorRoute ) {
			currentRoute = errorRoute;
		}

		this.setState({"current": currentRoute});
	}

	matchPath ( path ) {
		if ( Array.isArray(path) ) {
			for ( let v in path ) {
				if ( this.matchPath(path[v]) ) {
					return true;
				}
			}
			return false;
		}

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

	// Checks if route is a match
	matchRoute( a, b ) {
		for ( let i in this.state.match ) {
			let aMatch = a[this.state.match[i]] == "" ? null : a[this.state.match[i]];
			let bMatch = b[this.state.match[i]] == "" ? null : b[this.state.match[i]];

			if ( (aMatch == null) || (bMatch == null) ) {
				continue;
			}

			if ( Array.isArray(aMatch) ) {
				if ( !aMatch.includes(bMatch) ) {
					return false;
				}
			}
			else if ( aMatch != bMatch ) {
				return false;
			}
		}

		return true;
	}

	// Iterate through all routes and flatten them
	flattenRoutes( children, parent, reset ) {
		for ( let i in children ) {
			let child = children[i];

			if ( child.nodeName !== Route ) {
				continue;
			}

			let node = child;
			if ( parent ) {
				node = parent;
			}

			let props = {
				...node.attributes,
				...child.attributes
			};

			if ( props.static && parent && parent.attributes.path && child.attributes.path ) {
				props.path = parent.attributes.path + child.attributes.path;
			}

			if ( props.default && props.static && props.path ) {
				props.path = ["/", ...props.path];
			}

			child = cloneElement(child, props);

			this.state.routes.push(child);

			if ( child.children.length > 0 ) {
				this.flattenRoutes(child.children, child);
			}
		}
	}

	//Re-calculate routes when router props change
	componentWillReceiveProps( nextProps ) {
		if ( nextProps && nextProps.node && nextProps.node.id ) {
			this.setState({"routes": [], "params": {}});
			this.flattenRoutes(nextProps.children);
			this.getCurrentRoute(nextProps);
		}
	}

	render( props, state ) {
		if ( !state.current ) {
			return <div id="content" />;
		}

		return cloneElement(state.current, {...props, "params": state.params});
	}
}
