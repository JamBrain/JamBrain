import {h, Component}					from 'preact/preact';
import UIButton							from 'com/ui/button/button';
import UIText							from 'com/ui/text/text';

export default class UITextdown extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'show': false,
		};

		this.doShow = this.doShow.bind(this);
		this.doHide = this.doHide.bind(this);

		this.onModify = this.onModify.bind(this);
	}

	doShow( e ) {
		this.setState({'show': true});
	}
	doHide( e ) {
		this.setState({'show': false});
	}

	onModify( e ) {
		if ( this.props.onmodify ) {
			this.props.onmodify(e);
		}
	}

	onClick( index ) {
		console.log(index);
	}

	renderItem( item, index ) {
		if ( item && item.name ) {
			return (
				<UIButton class="-item" title={item.id+' - '+item.slug} onclick={this.onClick.bind(this, index)}>
					{item.name}
				</UIButton>
			);
		}

	}
	renderItems( items ) {
		let Out = [];

		for ( let idx = 0; idx < items.length; idx++ ) {
			Out.push(this.renderItem(items[idx], idx));
		}

		return <div class="-items">{Out}</div>;
	}

	render( props, state ) {
//		let Button = props.children.slice(0, 1);
//
//		let ShowContent = null;
//		if ( state.show ) {
//			let that = this;
//			let Children = props.children.slice(1);
//
//			let Content = [];
//			for ( let idx = 0; idx < Children.length; idx++ ) {
//				if ( Children[idx].attributes.onclick ) {
//					let OldClick = Children[idx].attributes.onclick;
//					Content.push(cloneElement(Children[idx], {
//						'onclick': function(e) {
//							that.doHide();
//							OldClick();
//						}
//					}));
//				}
//				else if ( Children[idx].attributes.href ) {
//					Content.push(cloneElement(Children[idx], {
//						'onclick': function(e) {
//							that.doHide();
//						}
//					}));
//				}
//				else {
//					Content.push(cloneElement(Children[idx]));
//				}
//			}
//
//			ShowContent = [
//				<div class="-content">
//					{Content}
//				</div>,
//				<div class="-click-catcher" onclick={this.doHide} />
//			];
//		}

		let ShowItems = null;
		if ( props.value && props.value.length ) {
			let Query = props.value.trim().toLowerCase();

			let Items = props.items;
			Items = Items.filter(word => word && word.name && word.name.indexOf && (word.name.toLowerCase().indexOf(Query) > -1));
			if ( Items.length ) {
				ShowItems = this.renderItems(Items);
			}
			else {
				ShowItems = <div class="-items"><div class="-item">No matching tag found</div></div>;
			}
		}

		let Classes = cN(
			'ui-textdown',
			props.class,
			props.left ? '-left' : null,
			props.right ? '-right' : null
		);

		return (
			<div class={Classes} ref={(input) => { this.ref = input; }}>
				<UIText class="-text" onmodify={this.onModify} maxlength={props.maxlength} value={props.value} placeholder={props.placeholder} />

				{ShowItems}
			</div>
		);
	}
}
