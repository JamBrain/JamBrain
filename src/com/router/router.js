import {h, Component, cloneElement} from 'preact/preact';
import Route from './route';
import PageError from 'com/pages/error/error';

export default class Router extends Component {
    constructor( props ) {
        super(props);

        let match = this.props.match ? this.props.match : ["type", "subtype", "subsubtype"];

        this.state = {
            "routes": [],
            "current": null,
            "match": match
        };


        if(this.props.node.id !== 0) {
            this.flattenRoutes(this.props.children);
            this.getCurrentRoute();
        }
    }

    // Works out what the current route is
    getCurrentRoute( next ) {
        let {node} = next ? next : this.props;
        let {routes} = this.state;

        if (!node) {
            return;
        }

        let currentRoute, defaultRoute, errorRoute;

        for (let i in routes) {
            let route = routes[i];

            if (this.matchRoute(route.attributes, node)) {
                if (route.attributes.static && route.attributes.path) {
                    if (!this.matchPath(route.attributes.path)) {
                        continue;
                    }
                }
                currentRoute = route;
            }

            if(route.attributes.type == "error") {
                errorRoute = route;
            }
        }

        if(!currentRoute && errorRoute) {
            currentRoute = errorRoute;
        }

        this.setState({"current": currentRoute});
    }

    // Checks if path is a match
    matchPath( path ) {
        if(Array.isArray(path)) {
            for(let v in path) {
                if(this.matchPath(path[v])) {
                    return true;
                }
            }
            return false;
        }

        let urlPath = (this.props.path ? this.props.path : window.location.pathname.split("/")).filter(n => n).reverse();
        let pathArray = path.split("/").filter(n => n).reverse();

        if(pathArray.length <= 0) {
            pathArray = [""];
        }

        if(urlPath.length <= 0) {
            urlPath = [""];
        }

        for(let i in pathArray) {
            if (pathArray[i] != urlPath[i]) {
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
                continue;
            }

            if(Array.isArray(aMatch)) {
                if(!aMatch.contains(bMatch)) {
                    return false;
                }
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
    flattenRoutes( children, parent, reset ) {
        if(reset) {
            this.setState({routes: []});
        }

        for (let i in children) {
            let child = children[i];

            if(child.nodeName !== Route) {
                continue;
            }

            parent = parent ? parent : child;

            let cloneProps = Object.assign(
                                {},
                                parent.attributes,
                                child.attributes
                            );

            let key = this.generateKey(cloneProps);

            if(cloneProps.default && cloneProps.static && cloneProps.path) {
                cloneProps.path = ["/", cloneProps.path];
            }

            child = cloneElement(child, Object.assign({}, cloneProps, {key: key}));

            this.state.routes.push(child);

            if (child.children.length > 0) {
                this.flattenRoutes(child.children, child);
            }
        }
    }

    //Re-calculate routes when router props change
    componentWillReceiveProps( next ) {
        if (next.node.id) {
            this.flattenRoutes(next.children, null, true);
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
