import {h, Component} 					from 'preact/preact';
import {shallowDiff}	 				from 'shallow-compare/index';

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
		let date_pub = new Date(node.modified);
		let date_now = new Date();
		let pub_diff = (date_now.getTime() - date_pub.getTime());// - (date_now.getTimezoneOffset()*60);

		// x minutes ago
		return <span>{this.props.label} <span title={getLocaleDate(date_pub)}>{getRoughAge(pub_diff)}</span></span>;
	}

	render( props ) {
		let ret = [];
		if ( !props.noby ) {
			// Prefix that goes before `by`
			if ( props.by && (typeof props.by == 'string') ) {
				ret.push(<span>{props.by} </span>);
			}
			ret.push(<span>by </span>);

			// Author names
			if ( props.authors ) {
				for ( var idx = 0; idx < props.authors.length; idx++ ) {
					ret.push(<span class="-name">{this.getName(props.authors[idx])}</span>);
					ret.push(" ");
					ret.push(
						<span>
							(<NavLink class="-at-name" href={this.getURL(props.authors[idx])}>@{this.getAtName(props.authors[idx])}</NavLink>)
							{((props.authors.length > 1) && (props.authors[idx].id == props.node.author)) ? <span title="Team Leader">*</span> : ''}
						</span>
					);
					if ( idx < props.authors.length-2 )
						ret.push(<span>, </span>);
					else if ( idx < props.authors.length-1 )
						ret.push(<span>, and </span>);
				}
			}
			else if ( props.author ) {
				ret.push(<span class="-name">{this.getName(props.author)}</span>);
				ret.push(" ");
				ret.push(<span>(<NavLink class="-at-name" href={this.getURL(props.author)}>@{this.getAtName(props.author)}</NavLink>)</span>);
			}
		}

		if ( props.when && props.node ) {
			ret.push(<span class="-when">{ret.length ? ", " : ''}{this.getWhen(props.node, props.label)}</span>);
		}
		else if ( props.modified && props.node ) {
			ret.push(<span class="-when">{ret.length ? ", " : ''}{this.getModified(props.node, props.label)}</span>);
		}

		return <div class={cN('content-common-body', '-by', props.class)}>{ret}{props.children}</div>;
	}
}
