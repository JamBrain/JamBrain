import './post.less';

import ContentSimple					from 'com/content-simple/simple';
import {UIIcon, UILink, UIButton}		from 'com/ui';

export default function ContentPost( props ) {
	let {node} = props;
	let newProps = {};

	//newProps.key = 'node-'+node.id;
	newProps.limit = 1024*24;

	// Additional properties
	//newProps.authored = 1;

	if ( node ) {
		if ( node.subtype === 'news' ) {
			//newProps.flag = "NEWS";
			newProps.by = "NEWS";
			newProps.flagIcon = "news";
			newProps.flagClass = "-col-c";
		}
		else if ( node.subtype === 'info' ) {
			//newProps.flag = "INFO";
			newProps.by = "INFO";
			newProps.flagIcon = "info";
			newProps.flagClass = "-col-nddd";
		}
		else if ( node.subtype === 'guide' ) {
			//newProps.flag = "GUIDE";
			newProps.by = "GUIDE";
			newProps.flagIcon = "article";
			newProps.flagClass = "-col-nddd";
		}
		else if ( node.subtype === 'promo' ) {
			//newProps.flag = "INFO";
			//newProps.by = "INFO";
			newProps.flagIcon = "gift";
			newProps.flagClass = "-col-ab";

			if ( newProps.single ) {
				if ( newProps.user && newProps.user.id ) {
					let body = <div>Unknown Promo Type</div>;

					// Shared promos have a single code used by many (associated with the node)
					if ( node.subsubtype == 'shared' ) {
						if ( node.meta['promo-code'] ) {
							let promoCode = node.meta['promo-code'].toLowerCase();

							// TODO: Replace this with a library function that can detect URLs

							let isURL = false;
							if ( promoCode.indexOf("http://") === 0 )
								isURL = true;
							if ( promoCode.indexOf("https://") === 0 )
								isURL = true;

							if ( isURL ) {
								body = (
									<div>
										<span>Link:</span> <strong><UILink href={node.meta['promo-code']}>{node.meta['promo-code']}</UILink></strong>
									</div>
								);
							}
							else {
								body = (
									<div>
										<span>Code:</span> <strong>{node.meta['promo-code']}</strong>
									</div>
								);
							}
						}
						else {
							body = <div>No `promo-code` associated with shared promo node.</div>;
						}
					}
					// Single promos have a pool of codes, and each user must request one
					else if ( node.subsubtype == 'single' ) {
						body = <div>{node.subsubtype}</div>;
					}

					// MK: Is this safe?
					newProps.children = (
						<div class="body -promo">
							<h2>Get Promo</h2>
							{body}
						</div>
					);
				}
				else {
					// MK: Is this safe?
					newProps.children = (
						<div class="body -promo">
							<h2>Get Promo</h2>
							<div>Login to claim</div>
						</div>
					);
				}
			}
			else {
				// MK: Is this safe?
				newProps.children = (
					<div class="body -promo">
						<UIButton class="content-common-nav-button" href={node.path}><UIIcon src="gift" /><div>Continue</div></UIButton>
					</div>
				);
			}
		}
	}

	return <ContentSimple {...props} {...newProps} />;
}
