import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';

export default class ContentCommonBodyBy extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props.children, nextProps.children);
	}
	
	getName( node ) {
		if ( node.meta['real-name'] )
			return node.meta['real-name'];
		return node.name;
	}

	getAtName( node ) {
		return node.name;
	}

	getURL( node ) {
		return '/users/'+node.slug;
	}
	
	getWhen( node ) {
		var date_pub = new Date(node.published);
		var date_now = new Date();
		var pub_diff = (date_now.getTime() - date_pub.getTime());// - (date_now.getTimezoneOffset()*60);
		
		// x minutes ago
		return <span title={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</span>;
	}
	getModified( node ) {
		var date_pub = new Date(node.modified);
		var date_now = new Date();
		var pub_diff = (date_now.getTime() - date_pub.getTime());// - (date_now.getTimezoneOffset()*60);
		
		// x minutes ago
		return <span title={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</span>;
	}

	render( props ) {
		props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
		props.class.push("content-common-body");
		props.class.push("-by");
		
		var Body = [];
		if ( props.author ) {
			Body.push(<span class="-name">by {this.getName(props.author)}</span>);
			Body.push(<span> (<NavLink class="-at-name" href={this.getURL(props.author)}>@{this.getAtName(props.author)}</NavLink>)</span>);
		}
		if ( props.when && props.node ) {
			Body.push(<span class="-when">{Body.length ? ', ' : ''}{props.label} {this.getWhen(props.node)}</span>);
		}
		else if ( props.modified && props.node ) {
			Body.push(<span class="-when">{Body.length ? ', ' : ''}{props.label} {this.getModified(props.node)}</span>);
		}
		
		return <div class={props.class}>{Body}{props.children}</div>;
	}
}
