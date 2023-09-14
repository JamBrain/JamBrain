import {Component} from 'preact';
import './common-body-link.less';

import Sanitize							from 'internal/sanitize';

import UIIcon							from 'com/ui/icon';

import InputText						from 'com/input-text/text';
import InputDropdown					from 'com/input-dropdown/dropdown';
import UIButton							from 'com/ui/button/button';

import $Tag								from 'shrub/js/tag/tag';


export default class ContentCommonBodyLink extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'items': null,			// raw tag results
			'itemlist': null,		// pairs (index, name) for the drop-down
			'indexes': null,		// lookup table that takes ids and converts them in to dropdown indexes
		};
	}

	componentDidMount() {
		$Tag.Get(this.props.filter)
			.then(r => {
				if ( r && r.tag && r.tag.length ) {
					let that = this;

					let NewState = {
						'items': r.tag,
						'itemlist': [],
						'indexes': {},
						//'tag': 0,
					};
					r.tag.forEach(item => {
						NewState.indexes[item.id] = NewState.itemlist.length;
						NewState.itemlist.push([item.id, item.name]);
					});

					//NewState.tag = NewState.itemlist[0][0];

					this.setState(NewState);
				}
			});
	}

	getTagAndIndex() {
		const {state, props} = this;
		const index = ((props.tag > 0) && state.indexes && state.indexes[props.tag] != null) ? state.indexes[props.tag] : props.defaultIndex;
		const tag = (state.itemlist && state.itemlist[index]) || [props.defaultValue, props.defaultText];
		return {index, tag};
	}

	componentDidUpdate() {
		if (!this.props.tag && this.props.onModifyTag) {
			const {index, tag} = this.getTagAndIndex();
			this.props.onModifyTag(tag[0]);
		}
	}

	render( props, state ) {
		let UrlPlaceholder = props.urlPlaceholder ? props.urlPlaceholder : 'URL (example: http://some.website.com/file.zip)';
		const {index, tag} = this.getTagAndIndex();
		if ( props.editing && state.itemlist && state.indexes ) {
			return (
				<div class={`link -editing ${props.class ?? ''}`}>
					<InputDropdown class="-tag"
						items={state.itemlist}
						value={tag[0]}
						onModify={props.onModifyTag}
						useClickCatcher={true}
						selfManaged={true}
					/>
					<InputText class="-name"
						value={props.name}
						onModify={props.onModifyName}
						placeholder={tag[1]}
						maxLength={64}
					/>
					<InputText class="-url"
						value={props.url}
						onModify={props.onModifyUrl}
						placeholder={UrlPlaceholder}
						maxLength={512}
					/>
					<UIButton onClick={props.onRemove} title="Remove"><UIIcon>cross</UIIcon></UIButton>
				</div>
			);
		}
		else if ( state.itemlist && props.url ) {
			let Text = Sanitize.sanitize_URI(props.url);
			let Href = Text.indexOf('//') != -1 ? Text : '';

			let ShowLink = Href ? (<a href={Href} target="_blank">{Text}</a>) : <span>{Text}</span>;

			let ShowName = props.name ? props.name : tag[1];

			let Icon = 'earth';
			if ( state.items[index].icon ) {
				Icon = state.items[index].icon;
			}

			return (
				<div class={`link ${props.class ?? ''}`}>
					<div class="-name" title={'$'+tag[0]+" - "+tag[1]}><UIIcon small>{Icon}</UIIcon> <span>{ShowName}</span></div>
					<div class="-url">{ShowLink}</div>
				</div>
			);
		}
		return <div />;
	}
}
