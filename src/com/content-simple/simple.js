import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';
import ContentCommon					from 'com/content-common/common';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyBy				from 'com/content-common/common-body-by';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyMarkup			from 'com/content-common/common-body-markup';

import $Node							from '../../shrub/js/node/node';


export default class ContentSimple extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'author': {}
		};

		if ( props.authored )
			this.getAuthor(props.node);
	}

	componentWillUpdate( newProps, newState ) {
		if ( this.props.node !== newProps.node ) {
			if ( this.props.authored ) {
				this.getAuthor(newProps.node);
			}
		}
	}

	getAuthor( node ) {
		// Clear the Author
		this.setState({ author: {} });

		// Lookup the author
		$Node.Get( node.author )
		.then(r => {
			if ( r.node && r.node.length ) {
				this.setState({ 'author': r.node[0] });
			}
			else {
				this.setState({ 'error': "Author not found" });
			}
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

	render( props, {author, error} ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		
		// Parse extra modes
		if ( extra ) {
			// If extra is 'edit', we're in edit mode
			var EditMode = extra.length ? extra[0] === 'edit' : false;
		}		

		if ( node && ((node.slug && !props.authored) || (node.slug && author && author.slug)) ) {
			props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
			props.class.push("content-simple");
			
			let ShowAvatar = null;
			let ShowByLine = null;
			if ( props.authored ) {
				ShowAvatar = <ContentCommonBodyAvatar src={author.meta && author.meta.avatar ? author.meta.avatar : ''} />;
				ShowByLine = <ContentCommonBodyBy node={node} author={author} label="published" when />;
			}

			return (
				<ContentCommon {...props}>
					{ShowAvatar}
					<ContentCommonBodyTitle href={path} title={node.name} />
					{ShowByLine}
					<ContentCommonBodyMarkup class="-block-if-not-minimized">{node.body}</ContentCommonBodyMarkup>
					{props.children}
				</ContentCommon>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
