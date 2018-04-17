import {h, Component} 					from 'preact/preact';
import ContentSimple					from 'com/content-simple/simple';
import UIIcon							from 'com/ui/icon/icon';
import UILink							from 'com/ui/link/link';
import UIButton							from 'com/ui/button/button';

//import $Node							from '../../shrub/js/node/node';

export default class ContentPost extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra} = props;
		props = Object.assign({}, props);

		// Additional properties
		//props.authored = 1;

		if ( node ) {
			if ( node.subtype === 'news' ) {
				//props.header = "NEWS";
				props.by = "NEWS";
				props.headerIcon = "news";
				props.headerClass = "-col-c";
			}
			else if ( node.subtype === 'info' ) {
				//props.header = "INFO";
				props.by = "INFO";
				props.headerIcon = "info";
				props.headerClass = "-col-nddd";
			}
			else if ( node.subtype === 'guide' ) {
				//props.header = "GUIDE";
				props.by = "GUIDE";
				props.headerIcon = "article";
				props.headerClass = "-col-nddd";
			}
			else if ( node.subtype === 'promo' ) {
				//props.header = "INFO";
				//props.by = "INFO";
				props.headerIcon = "gift";
				props.headerClass = "-col-ab";
				if ( props.single ) {
					if ( props.user && props.user.id ) {
						let Body = <div>Unknown Promo Type</div>;

						// Shared promos have a single code used by many (associated with the node)
						if ( node.subsubtype == 'shared' ) {
							if ( node.meta['promo-code'] ) {
								let PromoCode = node.meta['promo-code'].toLowerCase();

								// TODO: Replace this with a library function that can detect URLs

								let IsURL = false;
								if ( PromoCode.indexOf("http://") === 0 )
									IsURL = true;
								if ( PromoCode.indexOf("https://") === 0 )
									IsURL = true;
								if ( PromoCode.indexOf("ftp://") === 0 )
									IsURL = true;

								if ( IsURL ) {
									Body = (
										<div>
											<span>Link:</span> <strong><UILink href={node.meta['promo-code']}>{node.meta['promo-code']}</UILink></strong>
										</div>
									);
								}
								else {
									Body = (
										<div>
											<span>Code:</span> <strong>{node.meta['promo-code']}</strong>
										</div>
									);
								}
							}
							else {
								Body = <div>No `promo-code` associated with shared promo node.</div>;
							}
						}
						// Single promos have a pool of codes, and each user must request one
						else if ( node.subsubtype == 'single' ) {
							Body = <div>{node.subsubtype}</div>;
						}

						props.children = (
							<div class="content-common-body -promo">
								<h2>Get Promo</h2>
								{Body}
							</div>
						);
					}
					else {
						props.children = (
							<div class="content-common-body -promo">
								<h2>Get Promo</h2>
								<div>Login to claim</div>
							</div>
						);
					}
				}
				else {
					props.children = (
						<div class="content-common-body -promo">
							<UIButton class="content-common-nav-button" href={node.path}><UIIcon src="gift" /><div>Continue</div></UIButton>
						</div>
					);
				}
			}
		}

		props.limit = 1024*24;

		return <ContentSimple {...props} />;
	}
}
