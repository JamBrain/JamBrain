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
		return node.slug;
	}

	getURL( node ) {
		return '/users/'+node.slug;
	}
	
	getWhen( node, label ) {
		if ( node.published ) {
			var date_pub = new Date(node.published);
			if ( node.meta['origin-date'] ) {
				date_pub = new Date(node.meta['origin-date']);
			}
			var date_now = new Date();
			var pub_diff = (date_now.getTime() - date_pub.getTime());// - (date_now.getTimezoneOffset()*60);
			
			// x minutes ago
			return <span>{label} <span title={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</span></span>;
		}
		else {
			return <span>not {label} yet</span>;			
		}
	}
	getModified( node, label ) {
		var date_pub = new Date(node.modified);
		var date_now = new Date();
		var pub_diff = (date_now.getTime() - date_pub.getTime());// - (date_now.getTimezoneOffset()*60);
		
		// x minutes ago
		return <span>{this.props.label} <span title={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</span></span>;
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
		if ( props.authors ) {
			Body.push(<span>by </span>);
			for ( var idx = 0; idx < props.authors.length; idx++ ) {
				Body.push(<span class="-name">{this.getName(props.authors[idx])}</span>);
				Body.push(<span> (<NavLink class="-at-name" href={this.getURL(props.authors[idx])}>@{this.getAtName(props.authors[idx])}</NavLink>)</span>);
				if ( idx < props.authors.length-2 )
					Body.push(<span>, </span>);
				else if ( idx < props.authors.length-1 )
					Body.push(<span>, and </span>);
			}
		}
		if ( props.when && props.node ) {
			Body.push(<span class="-when">{Body.length ? ', ' : ''}{this.getWhen(props.node, props.label)}</span>);
		}
		else if ( props.modified && props.node ) {
			Body.push(<span class="-when">{Body.length ? ', ' : ''}{this.getModified(props.node, props.label)}</span>);
		}
		
		return <div class={props.class}>{Body}{props.children}</div>;
	}
}
