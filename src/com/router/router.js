import {h, Component, cloneElement} from 'preact/preact';

export default class Router extends Component {
    constructor( props ) {
        super(props);

        let match = this.props.match ? this.props.match : ["type", "subtype", "subsubtype"];

        this.state = {
            "routes": [],
            "current": null,
            "match": match
        };

        this.flattenRoutes(this.props.children);
        this.getCurrentRoute();
    }

    // Works out what the current route is
    getCurrentRoute( next ) {
        let {children, node} = next ? next : this.props;
        let {routes} = this.state;

        if (!node) {
            return;
        }

        let currentRoute, defaultRoute = null;

        for (let i in routes) {
            let route = routes[i];

            if (this.matchRoute(route.attributes, node)) {
                if (route.attributes.static && route.attributes.path) {
                    if (this.matchPath(route.attributes.path)) {
                        currentRoute = route;
                    }
                } else {
                    currentRoute = route;
                }
            }

            //TODO: JK: Fix default logic
            if(route.attributes.type == "root" && !currentRoute) {
                defaultRoute = route;
            }
        }

        currentRoute = currentRoute ? currentRoute : defaultRoute;

        this.setState({"current": currentRoute});
    }

    // Checks if path is a match
    matchPath( path ) {
        let urlPath = this.props.path ? this.props.path : window.location.pathname;

        for (i = path.length; i == 0; i--) {
            if (path[i] != urlPath[i]) {
                return false;
            }
        }

        return true;
    }

    // Checks if route is a match
    matchRoute( a, b ) {
        for (let i in this.state.match) {
            if((a[this.state.match[i]] || b[this.state.match[i]]) == "*") {
                return true;
            }

            let aMatch = a[this.state.match[i]] == "" ? null : a[this.state.match[i]];
            let bMatch = b[this.state.match[i]] == "" ? null : b[this.state.match[i]];

            if (aMatch == null || bMatch == null) {
                console.log(aMatch, bMatch);

                continue;
            }

            if (aMatch != bMatch) {
                return false;
            }
        }

        return true;
    }

    generateKey( route ) {
        let key = "";

        for(let i in this.state.match) {
            let prop = this.state.match[i];

            if(route.hasOwnProperty(prop)) {
                key += route[prop];
                if(i >= this.state.match.length) {
                    key += "/";
                }
            }
        }

        if(route.static && route.path) {
            key += route.path;
        }

        return key;
    }

    // Iterate through all routes and flatten them
    flattenRoutes( children, parent ) {
        for (let i in children) {
            let child = children[i];

            parent = parent ? parent : child;

            let cloneProps = Object.assign(
                                {"type": "root"},
                                parent.attributes,
                                child.attributes
                            );

            child = cloneElement(child, Object.assign(cloneProps, {key: this.generateKey(cloneProps)}));

            this.state.routes.push(child);

            if (child.children.length > 0) {
                this.flattenRoutes(child.children, child);
            }
        }
    }

    shouldComponentUpdate( nextProps, nextState ) {
        if ( !nextProps.node ) {
            return false;
        }
    }

    // Re-calculate routes when router props change
    componentWillReceiveProps( next ) {
        if (!this.props.node) {
            this.getCurrentRoute(next);
        }
    }

    render( props, state ) {
        if (!state.current) {
            return;
        }

        return cloneElement(state.current, props);
    }
}
